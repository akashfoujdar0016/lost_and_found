import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Load env file based on `mode`
    const env = loadEnv(mode, process.cwd(), '')
    
    // Check if Firebase API Key actually exists and is not a placeholder
    const isMockMode = !env.VITE_FIREBASE_API_KEY || 
                       env.VITE_FIREBASE_API_KEY.includes('your_') || 
                       env.VITE_FIREBASE_API_KEY.includes('your-');

    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    return {
        plugins: [react()],
        resolve: {
            alias: isMockMode ? {
                // Intercept Firebase calls and route them to our localStorage mocks
                'firebase/app': path.resolve(__dirname, 'src/lib/localApp.js'),
                'firebase/auth': path.resolve(__dirname, 'src/lib/localAuth.js'),
                'firebase/firestore': path.resolve(__dirname, 'src/lib/localFirestore.js'),
                'firebase/storage': path.resolve(__dirname, 'src/lib/localStorage.js'),
            } : {}
        },
        build: {
            chunkSizeWarningLimit: 1000,
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            if (id.includes('firebase')) {
                                return 'firebase';
                            }
                            if (id.includes('react')) {
                                return 'react-vendor';
                            }
                            if (id.includes('framer-motion') || id.includes('lucide')) {
                                return 'ui-vendor';
                            }
                            return 'vendor';
                        }
                    }
                }
            }
        }
    }
})
