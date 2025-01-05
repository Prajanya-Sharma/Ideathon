/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['tesseract.js'],
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/**/*.wasm', './node_modules/**/*.proto']
    }
  };
  
  export default nextConfig;
  