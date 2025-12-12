import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import CreateRfp from "./pages/CreateRfp";
import Vendors from "./pages/Vendors";
import SendRfp from "./pages/SendRfp";
import RfpList from "./pages/RfpList";
import RfpDetails from "./pages/RfpDetails";
import ProposalComparison from "./pages/ProposalComparison";
import Wizard from "./pages/Wizard";
import WizardSuccess from "./pages/WizardSuccess";


export default function App() {


  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/wizard" element={<Wizard />} />

        <Route path="/create-rfp" element={<CreateRfp />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/send-rfp" element={<SendRfp />} />
        <Route path="/rfps" element={<RfpList />} />
        <Route path="/rfp/:id" element={<RfpDetails />} />
        <Route path="/rfp/:id/compare" element={<ProposalComparison />} />
        <Route path="/wizard-success" element={<WizardSuccess />} />

      </Routes>
    </BrowserRouter>
  );
}
