import { useEffect } from "react";

const FacebookMessenger = () => {
  useEffect(() => {
    if (window.FB) return;

    window.fbAsyncInit = function () {
      window.FB.init({
        xfbml: true,
        version: "v18.0",
      });
    };

    const script = document.createElement("script");
    script.id = "facebook-jssdk";
    script.src =
      "https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js";
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);
  }, []);

  return (
    <>
      <div id="fb-root"></div>
      <div
        className="fb-customerchat"
        attribution="setup_tool"
        page_id="61584898455052"
      ></div>
    </>
  );
};

export default FacebookMessenger;
