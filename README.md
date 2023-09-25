## Project Description
-- non-tech part --
PlantieCare project was created as my graduation project at Mind Mingle Bootcamp. It solves several problems my friends and I have as plants owners. 
1. Helps to track care of your plants (watering, fertilisers and diseases);
2. Gives you opportunity to share your plants with a friend/family member who is planning to take care after them while you are travelling or absent, a caretaker does not need to register, they can simply scan a QR code or use a provided link to gain restricted access to your plants and log watering.

-- tech part --
The app has a responsive design with "mobile first" approach at it's core.
Although during the bootcamp we mostly focused on JS technologies in all our projects, for this particular one I decided to challenge myself and take new technologies I have never worked before: FastAPI, SQLAlchemy, Pydantic, AWS S3, and Tailwind. It was a great challenge, to build an entire app from sctratch using several unfamiliar technologies within 2.5 weeks and now I am happy to present the result.
For code delivery I used docker containers (also for development), the project is deployed on AWS EC2.

To access the app, please, navigate here: https://plantie-care.klestova.nl/
To access API documentation, please, check out this link: https://plantie-care-api.klestova.nl/docs#/

I want to say thank you to the two senior software engineers who reviewed my code and gave insights on how to make it cleaner, more readable and more maintainable, I spent one whole evening to refactor:D

## Frontend Technologies
The frontend part of the project is built using Next.js (React) and TypeScript, data validation is performed with Zod, Axios is used as http client, Tailwind is chosen for styling, QR codes are generated using next-qrcode package, the project also contains shadcn UI components and simple framer motion animation.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
