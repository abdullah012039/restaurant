"use client"

import React, { createContext, useContext, useReducer, useEffect } from "react"
import type { CartItem, MenuItem } from "@/lib/types"
import type { PublicAPIData } from "@/lib/api"
import { fetchPublicData } from "@/lib/api"
import { updateThemeColors } from "@/lib/theme"

interface AppState {
  theme: "light" | "dark"
  cart: CartItem[]
  favorites: MenuItem[]
  searchQuery: string
  selectedCategory: string | null
  isLoading: boolean
  notifications: { id: string; message: string; type: "success" | "error" }[]
  publicData: PublicAPIData | null
}

type AppAction =
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: number }
  | { type: "UPDATE_CART_ITEM"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "ADD_TO_FAVORITES"; payload: MenuItem }
  | { type: "REMOVE_FROM_FAVORITES"; payload: number }
  | { type: "SET_SEARCH_QUERY"; payload: string }
  | { type: "SET_SELECTED_CATEGORY"; payload: string | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "ADD_NOTIFICATION"; payload: { id: string; message: string; type: "success" | "error" } }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "SET_PUBLIC_DATA"; payload: PublicAPIData }

const initialState: AppState = {
  theme: "light",
  cart: [],
  favorites: [],
  searchQuery: "",
  selectedCategory: null,
  isLoading: true,
  notifications: [],
  publicData: null,
}

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.payload }
    case "ADD_TO_CART":
      return {
        ...state,
        cart: [...state.cart, action.payload],
      }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      }
    case "UPDATE_CART_ITEM":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
    case "CLEAR_CART":
      return { ...state, cart: [] }
    case "ADD_TO_FAVORITES":
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      }
    case "REMOVE_FROM_FAVORITES":
      return {
        ...state,
        favorites: state.favorites.filter((item) => item.id !== action.payload),
      }
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.payload }
    case "SET_SELECTED_CATEGORY":
      return { ...state, selectedCategory: action.payload }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      }
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
      }
    case "SET_PUBLIC_DATA":
      return {
        ...state,
        publicData: action.payload,
        isLoading: false,
      }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark"
    if (savedTheme) {
      dispatch({ type: "SET_THEME", payload: savedTheme })
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      parsedCart.forEach((item: CartItem) => {
        dispatch({ type: "ADD_TO_CART", payload: item })
      })
    }

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      const parsedFavorites = JSON.parse(savedFavorites)
      parsedFavorites.forEach((item: MenuItem) => {
        dispatch({ type: "ADD_TO_FAVORITES", payload: item })
      })
    }

    // Load public data only once when the app starts
    const loadData = async () => {
      try {
        const data = await fetchPublicData()
        dispatch({ type: "SET_PUBLIC_DATA", payload: data })

        // Apply theme colors from the API
        if (data && 'system' in data && data.system.design_settings) {
          const { design_settings } = data.system
          updateThemeColors({
            primaryColor: design_settings.primary_color,
            secondaryColor: design_settings.secondary_color,
            background: design_settings.background,
            foreground: design_settings.foreground,
            border: design_settings.border,
            radius: design_settings.radius
          })
        }
      } catch (error) {
        console.error("Error loading public data:", error)
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    loadData()
  }, []) // Empty dependency array ensures this runs only once

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("theme", state.theme)
  }, [state.theme])

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart))
  }, [state.cart])

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(state.favorites))
  }, [state.favorites])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
