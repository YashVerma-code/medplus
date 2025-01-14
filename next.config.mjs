/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'utfs.io',
            },
            {
                hostname: 'cdn.pixabay.com',
            },
            {
                hostname: 'www.shutterstock.com',
            },
            {
                hostname: 'static.vecteezy.com',
            },
            {
                hostname: 'www.hookphish.com',
            },
            {
                hostname: 'previews.123rf.com',
            },
            {
                hostname: 'c7.alamy.com',
            },
            {
                hostname: 'img.freepik.com',
            },
            {
                hostname: 'encrypted-tbn0.gstatic.com',
            },
            {
                hostname: 'media.istockphoto.com',
            },
            {
                hostname: 'c8.alamy.com',
            },
        ]
    }
};

export default nextConfig;
