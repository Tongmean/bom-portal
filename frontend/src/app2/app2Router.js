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
import PutSingleProcessOrder from "./page/Routing/processOrder/PustSingleProcessOrder";
import ProcessOrderTooling from "./page/Routing/processOrdertooling/ProcessRoutingTooling";
import PostSingleProcessRoutingTooling from "./page/Routing/processOrdertooling/PostSingleProcessRoutingTooling";
import PutSingleProcessRoutingTooling from "./page/Routing/processOrdertooling/PutSingleProcessRoutingTooling";
import SemiFgRegister from "./page/ProductRegister/SemiFgRegister/SemiFgRegister";
import POSTARRAYSemifg from "./page/ProductRegister/SemiFgRegister/POSTARRAYSemifg";
import EditSemiFG from "./page/ProductRegister/SemiFgRegister/PUTARRAYSemifg";
import Spec from "./page/Productspec/Spec/Productspec";
import PostSinglespec from "./page/Productspec/Spec/PostSingleSpec";
import PutSinglespec from "./page/Productspec/Spec/PutSinglespec";
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
          <Spec />
        )
      },
      {
        path: "product-spec/product-spec/postSingle",
        element: (
          <PostSinglespec />
        )
      },
      {
        path: "product-spec/product-spec/updateSingle/:id",
        element: (
          <PutSinglespec />
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
      {
        path: "process/routing-order/putSingle/:id",
        element: (
          < PutSingleProcessOrder/>
        )
      },
      {
        path: "process/routing-order-tooling/",
        element: (
          < ProcessOrderTooling/>
        )
      },
      {
        path: "process/routing-order-tooling/postSingle",
        element: (
          < PostSingleProcessRoutingTooling/>
        )
      },
      {
        path: "process/routing-order-tooling/putSingle/:id",
        element: (
          < PutSingleProcessRoutingTooling/>
        )
      },
      {
        path: "product-register/semifg-Register",
        element: (
          < SemiFgRegister/>
        )
      },
      {
        path: "product-register/semifg-Register/postArray",
        element: (
          < POSTARRAYSemifg/>
        )
      },
      {
        path: "product-register/semifg-Register/updateArray",
        element: (
          < EditSemiFG/>
        )
      },
    ]
  }
];