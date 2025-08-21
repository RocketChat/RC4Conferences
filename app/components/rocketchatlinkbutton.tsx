import React from "react";
import { NavLink } from "react-bootstrap";

const channelLink = process.env.NEXT_PUBLIC_ROCKETCHAT_URl
  ? `${process.env.NEXT_PUBLIC_ROCKETCHAT_URl}/channel/${process.env.NEXT_PUBLIC_RC_ROOM_ID}`
  : "https://open.rocket.chat/channel/events-and-meet-ups";

const RocketChatLinkButton = ({
  children,
  href = channelLink,
  ...props
}) => {
  return (
    <NavLink target="_blank" href={href} {...props}>
      {children}
    </NavLink>
  );
};

export default RocketChatLinkButton;
