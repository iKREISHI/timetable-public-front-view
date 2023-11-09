/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        URL_API_SHEDULE: process.env.URL_API_SHEDULE,
        URL_API_AUDITORIUM: process.env.URL_API_AUDITORIUM,
        URL_API_UNIVERSITYUNIT: process.env.URL_API_UNIVERSITYUNIT,
        URL_API_SHEDULE_WEEK: process.env.URL_API_SHEDULE_WEEK,
    }
}

module.exports = nextConfig


