import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      BASE_URL : 'https://api.keywordhelper.click/api/v1',
      URL : "https://www.keywordhelper.click"
    },
  },
	server : {
	  prot : 5143,
	  host : '0.0.0.0' 

  }	 
})
