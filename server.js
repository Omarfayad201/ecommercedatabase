import express from 'express';
import dotenv from "dotenv";
import { connectDb } from './db/dbConnection.js';
import authRouter from "./src/modules/auth/auth.routes.js"
import categoryRouter from "./src/modules/category/category.routes.js";
import SubcategoryRouter from './src/modules/subcategory/subcategory.routes.js';
import brandRouter from "./src/modules/brand/brand.routes.js"
import couponRouter from "./src/modules/coupon/coupon.routes.js"
import productRouter from './src/modules/product/product.routes.js'
import cartRouter from "./src/modules/cart/cart.routes.js"
import orderRouter from "./src/modules/order/order.routes.js"
import reviewRouter from "./src/modules/review/review.routes.js"
import morgan from 'morgan';
import cors from "cors"

dotenv.config();
const app = express();
const port = process.env.PORT;

// cors
// const whitelist = ["http://127.0.0.1:5500"];
// app.use((req, res, next) => {
//   if (req.originalUrl === "/auth/activate_account") {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "GET");
//     return next();
// }
//   if (!whitelist.includes(req.header("origin"))) {
//     return next(new Error("Blocked By CORS!"));
//   }
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   res.setHeader("Access-Control-Allow-Methods", "*");
//   res.setHeader("Access-Control-Private-Network", true);
//   return next();
// })

app.use(cors());

//morgan
app.use(morgan("combined"))


//parsing

app.use(express.json());

// connect database
await connectDb();
//////////////////////

// createInvoice(invoice,"invoice.pdf")
//////////////

//routers
app.use("/auth", authRouter)

app.use("/category", categoryRouter)

app.use("/subcategory", SubcategoryRouter)

app.use("/brand", brandRouter)

app.use("/coupon", couponRouter)

app.use("/product", productRouter)

app.use("/cart", cartRouter)

app.use("/order", orderRouter)

app.use("/review", reviewRouter)

//page not found handler
app.all("*", (req, res, next) => {
    return next(
      new Error(`page not found`, { cause: 404 })
    );
})



//global error handler 
app.use((error, req, res, next) => {
    const statusCode = error.cause || 500
  return res.status(statusCode).json({ success: false, message: error.message || error, stack: error.stack });
})

app.listen(process.env.PORT || port, () => console.log(` app listening on port ${port}!`));
