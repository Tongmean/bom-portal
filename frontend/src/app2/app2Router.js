// app1Router.tsx

import App2Layout from "./App2Layout";
import Home from "./page/home/Home";
import Engineeringpart from "./page/engineeringPart/Engineeringpart";
import Sdpackaging from "./page/sdpackaging/Sdpackaging";
import Customer from "./page/Productspec/custmer/Customer";
import PostArrayCustomer from "./page/Productspec/custmer/PostArrayCustomer"
import UpdateArrayCustomer from "./page/Productspec/custmer/UpdateArrayCustomer";
import Productspec from "./page/Productspec/Productspec/Productspec";
import ProtectRoute from "./utility/protectedRoute";
import PostSingleproductspec from "./page/Productspec/Productspec/PostSingleproductspec";
import UpdateSingleproductspec from "./page/Productspec/Productspec/UpdateSingleproductspec";


export const app2Routes = [
  {
    path: "/app2",
    element: (
      <ProtectRoute>
        <App2Layout />
      </ProtectRoute>
    ),
    children: [
      // { path: "home",
      //   // index: true,
      //   element: <Home />
      // },
      // {
      //   path: "users",
      //   element: <Users />
      // }
      {
        path: "home",
        element: (
            <Home />
        )
      },
      {
        path: "engineering/drawing",
        element: (
          <Engineeringpart />
        )
      },

      {
        path: "sdPackaging/packaging",
        element: (
          <Sdpackaging />
        )
      },
      {
        path: "product-spec/Customer",
        element: (
          <Customer />
        )
      },
      {
        path: "product-spec/Customer/postArray",
        element: (
          <PostArrayCustomer />
        )
      },
      {
        path: "product-spec/Customer/updateArray",
        element: (
          <UpdateArrayCustomer />
        )
      },
      {
        path: "product-spec/product-spec",
        element: (
          <Productspec />
        )
      },
      {
        path: "product-spec/product-spec/postSingle",
        element: (
          <PostSingleproductspec />
        )
      },
      {
        path: "product-spec/product-spec/updateSingle/:id",
        element: (
          <UpdateSingleproductspec />
        )
      },
    ]
  }
];