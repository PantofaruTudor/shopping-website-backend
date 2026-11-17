# Shopping Website (backend)

The server behind my clothing store website. It's an Express app connected to
MongoDB Atlas. It sends the products to the frontend, handles register and
login (bcrypt for passwords, JWT for staying logged in) and returns each
user's wishlist.

Live site: https://shopping-website-frontend.netlify.app

Frontend code: [shopping-website-frontend](https://github.com/PantofaruTudor/shopping-website-frontend)

It's hosted on Render, and the main routes are `/api/v1/products`,
`/auth/register`, `/auth/login` and `/api/wishlist`.

Getting the frontend on Netlify and the backend on Render to talk to each
other took me a while, mostly because of CORS errors. That was one of the
things I learned the most from in this project.

The `server/public` folder has the first version of the site, before I moved
the frontend to React. I kept it because it shows where the project started.

To run it locally:

    npm install
    npm run dev

You'll need a `.env` file in the root folder with `MONGO_URI` and
`MONGO_URI_USER` (see `.env.example`). The server starts on
http://localhost:5001.
