import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// @ts-ignore
// const isDevMode = import.meta.env.VITE_DEVMODE
console.log('mode: ', "Hey");

// https://vitejs.dev/config/
export default defineConfig({
  // base: isDevMode ? "/" :"/webauthn/",
  base: "/" ,
  plugins: [react()]

  
})
