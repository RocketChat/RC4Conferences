import React from "react";
import { NavLink } from "react-bootstrap";

const channelLink = process.env.NEXT_PUBLIC_ROCKETCHAT_URl
  ? `${process.env.NEXT_PUBLIC_ROCKETCHAT_URl}/channel/${process.env.NEXT_PUBLIC_RC_ROOM_ID}`
  : "https://open.rocket.chat/channel/GENERAL";

const RocketChatLinkButton = ({
  children,
  href = "https://open.rocket.chat/channel/DemoDay2022",
  ...props
}) => {
  return (
    <NavLink target="_blank" href={href} {...props}>
      {children}
    </NavLink>
  );
};

export default RocketChatLinkButton;
