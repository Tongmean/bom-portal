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
import PostSingleengineeringpart from "./page/engineeringPart/PostSingleEngineeringpart";
import PutSingleengineeringpart from "./page/engineeringPart/putSingleEngineeringpart";
import PostSinglesdpackaging from "./page/sdpackaging/PostSinglesdpackaging";
import PutSinglesdpackaging from "./page/sdpackaging/PutSinglesdpackaging";
import Foam from "./page/Foam/Foam";
import PostSinglefoam from "./page/Foam/PostSinglefoam";
import PutSinglefoam from "./page/Foam/PutSinglefoam";
import M_master_mat from "./page/Master/Mat/M_mat";
import PostSinglemat from "./page/Master/Mat/postSingleMat";
import PutSinglemat from "./page/Master/Mat/putSingleMat";
import Certificate from "./page/Certificate/Certificate";
import PostSingleCertificate from "./page/Certificate/PostSingleCertificate";
import PutSingleCertificate from "./page/Certificate/PutSingleCertificate";
import ProcessOrder from "./page/Routing/processOrder/ProcessOrder";
import PostSingleProcessOrder from "./page/Routing/processOrder/PostSingleProcessOrder";
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
        path: "engineering/drawing/postSingle",
        element: (
          <PostSingleengineeringpart />
        )
      },
      {
        path: "engineering/drawing/updateSingle/:id",
        element: (
          <PutSingleengineeringpart />
        )
      },

      {
        path: "sdPackaging/packaging",
        element: (
          <Sdpackaging />
        )
      },
      {
        path: "sdPackaging/packaging/postSingle",
        element: (
          <PostSinglesdpackaging />
        )
      },
      {
        path: "sdPackaging/packaging/putSingle/:id",
        element: (
          <PutSinglesdpackaging />
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
      {
        path: "additionalFaom",
        element: (
          <Foam />
        )
      },
      {
        path: "additionalFaom/postSingle",
        element: (
          <PostSinglefoam />
        )
      },
      {
        path: "additionalFoam/putSingle/:id",
        element: (
          <PutSinglefoam />
        )
      },
      {
        path: "master/mat",
        element: (
          <M_master_mat />
        )
      },
      {
        path: "master/mat/postSingle",
        element: (
          <PostSinglemat />
        )
      },
      {
        path: "master/mat/putSingle/:id",
        element: (
          <PutSinglemat />
        )
      },
      {
        path: "certificate",
        element: (
          <Certificate />
        )
      },
      {
        path: "certificate/postSingle",
        element: (
          <PostSingleCertificate />
        )
      },
      {
        path: "certificate/putSingle/:id",
        element: (
          <PutSingleCertificate />
        )
      },
      {
        path: "process/routing-order",
        element: (
          < ProcessOrder/>
        )
      },
      {
        path: "process/routing-order/postSingle",
        element: (
          < PostSingleProcessOrder/>
        )
      },
    ]
  }
];