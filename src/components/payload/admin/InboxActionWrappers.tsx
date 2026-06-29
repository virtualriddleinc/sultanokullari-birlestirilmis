"use client";

import InboxQuickActions from "./InboxQuickActions";
import InboxAutoRead from "./InboxAutoRead";

export function ContactInboxActions() {
  return (
    <>
      <InboxAutoRead collectionSlug="contact-messages" />
      <InboxQuickActions collectionSlug="contact-messages" />
    </>
  );
}

export function IkInboxActions() {
  return (
    <>
      <InboxAutoRead collectionSlug="ik-applications" />
      <InboxQuickActions collectionSlug="ik-applications" />
    </>
  );
}
