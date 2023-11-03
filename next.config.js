/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        URL_API_SHEDULE: process.env.URL_API_SHEDULE,
        URL_API_AUDITORIUM: process.env.URL_API_AUDITORIUM,
        URL_API_UNIVERSITYUNIT: process.env.URL_API_UNIVERSITYUNIT
    }
}

module.exports = nextConfig


