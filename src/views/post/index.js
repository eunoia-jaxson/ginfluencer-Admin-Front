import { useLocation } from "react-router-dom";
import PopupList from "./../popup/index";
import Index from "./../popup/popup_form";
import DonationForm from "./../donation/donation_form";

const Post = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get("type");

  return (
    <div>
      {type === "popup" ? (
        <PopupList />
      ) : type === "popup/popupForm" ? (
        <Index />
      ) : type === "donation" ? (
        <DonationForm />
      ) : (
        <h1>Default Post Content</h1>
      )}{" "}
    </div>
  );
};

export default Post;
