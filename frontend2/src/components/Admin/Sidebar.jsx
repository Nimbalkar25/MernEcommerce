import React from "react";
import "./sidebar.css";
import logo from "../../images/logo.png";
import { Link } from "react-router-dom";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddIcon from "@mui/icons-material/Add";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import RateReviewIcon from "@mui/icons-material/RateReview";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/">
        <img src={logo} alt="Ecommerce" />
      </Link>
      <Link to="/admin/dashboard">
        <p>
          <DashboardIcon /> Dashboard
        </p>
      </Link>

      <Accordion
        className="customAccordion"
        disableGutters
        elevation={0}
        square
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          className="customAccordionSummary"
        >
          <Link to="#" className="customAccordionLabel">
            <ImportExportIcon className="customAccordionIcon" />
            Products
          </Link>
        </AccordionSummary>

        <AccordionDetails className="customAccordionDetails">
          <Link to="/admin/products" className="customAccordionItem">
            <PostAddIcon className="customAccordionIcon" /> All
          </Link>
          <Link to="/admin/product" className="customAccordionItem">
            <AddIcon className="customAccordionIcon" /> Create
          </Link>
        </AccordionDetails>
      </Accordion>

      <Link to="/admin/orders">
        <p>
          <ListAltIcon />
          Orders
        </p>
      </Link>
      <Link to="/admin/users">
        <p>
          <PeopleIcon /> Users
        </p>
      </Link>
      <Link to="/admin/reviews">
        <p>
          <RateReviewIcon />
          Reviews
        </p>
      </Link>
    </div>
  );
};

export default Sidebar;
