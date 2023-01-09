const {
  carousels,
  guides,
  persona,
  personaIcons,
  releaseNotes,
  subMenus,
  topNavItem,
  speakers,
  forms,
  sessions,
  eventSessions,
} = require("../config/initialData");

module.exports = async () => {
  try {
    var carouselCount = await strapi.db.query("api::carousel.carousel").count();
    var personaIconsCount = await strapi.db
      .query("api::persona-icon.persona-icon")
      .count();
    var personaCount = await strapi.db.query("api::persona.persona").count();
    var subMenuCount = await strapi.db.query("api::sub-menu.sub-menu").count();
    var topNavItemCount = await strapi.db
      .query("api::top-nav-item.top-nav-item")
      .count();
    var releaseNotesCount = await strapi.db
      .query("api::release-note.release-note")
      .count();
    var guidesCount = await strapi.db.query("api::guide.guide").count();
    var formCount = await strapi.db.query("api::form.form").count();
    // var ghrepos = await strapi.db
    //   .query("api::github-repository.github-repository")
    //   .count({});
    var speakersCount = await strapi.db.query("api::speaker.speaker").count({});
    var sessionCount = await strapi.db.query("api::session.session").count({});
    var eventSessionsCount = await strapi.db
      .query("api::event-session.event-session")
      .count({});

    // initial fetch
    speakers.map(async (speaker, index) => {
      if (index <= speakersCount - 1) {
        await strapi.db.query("api::speaker.speaker").update({
          where: { id: speaker.id },
          data: {
            name: speaker.name,
            imageUrl: speaker.imageUrl,
            bio: speaker.bio,
            short_bio: speaker.short_bio,
            talk_topic: speaker.talk_topic,
            talk_summary: speaker.talk_summary,
            date_time: new Date(speaker.date_time).toISOString(),
            duration_minutes: speaker.duration_minutes,
            live: speaker.live,
            ended: speaker.ended,
          },
        });
      } else {
        await strapi.service("api::speaker.speaker").create({
          data: {
            name: speaker.name,
            imageUrl: speaker.imageUrl,
            bio: speaker.bio,
            short_bio: speaker.short_bio,
            talk_topic: speaker.talk_topic,
            talk_summary: speaker.talk_summary,
            date_time: new Date(speaker.date_time).toISOString(),
            duration_minutes: speaker.duration_minutes,
            live: speaker.live,
            ended: speaker.ended,
          },
        });
      }
    });

    try {
      sessions.map(async (session, index) => {
        if (index <= sessionCount - 1) {
          await strapi.db.query("api::session.session").update({
            where: { id: session.id },
            data: {
              Start: session.Start,
              End: session.End,
              Speaker: session.Speaker,
              Title: session.Title,
              Duration: session.Duration,
              Mentor: session.Mentors,
              Description: session.Description,
              Youtube: session.Youtube,
            },
          });
        } else {
          await strapi.db.query("api::session.session").create({
            data: {
              Start: session.Start,
              End: session.End,
              Speaker: session.Speaker,
              Title: session.Title,
              Duration: session.Duration,
              Mentor: session.Mentors,
              Description: session.Description,
              Youtube: session.Youtube,
            },
          });
        }
      });
    } catch (e) {
      console.error("Session error", e);
    }

    try {
      eventSessions.map(async (sessionit, index) => {
        if (index <= eventSessionsCount - 1) {
          await strapi.db.query("api::event-session.event-session").update({
            where: { id: sessionit.id },
            data: {
              event_name: sessionit.event_name,
              event_id: sessionit.event_id,
              session_items: sessionit.session_items,
            },
          });
        } else {
          await strapi.db.query("api::event-session.event-session").create({
            data: {
              event_name: sessionit.event_name,
              event_id: sessionit.event_id,
              session_items: sessionit.session_items,
            },
          });
        }
      });
    } catch (e) {
      console.error("event error", e);
    }

    forms.map(async (form, index) => {
      if (index <= formCount - 1) {
        await strapi.db.query("api::form.form").update({
          where: { id: form.id },
          data: {
            title: form.title,
            formQs: form.formQs,
          },
        });
      } else {
        await strapi.service("api::form.form").create({
          data: {
            title: form.title,
            formQs: form.formQs,
          },
        });
      }
    });

    carousels.map(async (carousel, index) => {
      if (index <= carouselCount - 1) {
        await strapi.db.query("api::carousel.carousel").update({
          where: { id: carousel.id },
          data: {
            name: carousel.name,
            description: carousel.description,
            url: carousel.url,
            imageUrl: carousel.imageUrl,
          },
        });
      } else {
        await strapi.service("api::carousel.carousel").create({
          data: {
            name: carousel.name,
            description: carousel.description,
            url: carousel.url,
            imageUrl: carousel.imageUrl,
          },
        });
      }
    });

    personaIcons.map(async (personaIcon, index) => {
      if (index <= personaIconsCount - 1) {
        await strapi.db.query("api::persona-icon.persona-icon").update({
          where: { id: personaIcon.id },
          data: {
            icon: personaIcon.icon,
            size: personaIcon.size,
            color: personaIcon.color,
          },
        });
      } else {
        await strapi.service("api::persona-icon.persona-icon").create({
          data: {
            icon: personaIcon.icon,
            size: personaIcon.size,
            color: personaIcon.color,
          },
        });
      }
    });

    persona.map(async (persona, index) => {
      if (index <= personaCount - 1) {
        await strapi.db.query("api::persona.persona").update({
          where: { id: persona.id },
          data: {
            name: persona.name,
            persona_icon: {
              id: persona.persona_icon.id,
              icon: persona.persona_icon.icon,
              size: persona.persona_icon.size,
              color: persona.persona_icon.color,
            },
          },
        });
      } else {
        await strapi.service("api::persona.persona").create({
          data: {
            name: persona.name,
            persona_icon: {
              id: persona.persona_icon.id,
              icon: persona.persona_icon.icon,
              size: persona.persona_icon.size,
              color: persona.persona_icon.color,
            },
          },
        });
      }
    });

    subMenus.map(async (subMenu, index) => {
      if (index <= subMenuCount - 1) {
        await strapi.db.query("api::sub-menu.sub-menu").update({
          where: { id: subMenu.id },
          data: {
            label: subMenu.label,
            url: subMenu.url,
            style: subMenu?.style,
          },
        });
      } else {
        await strapi.service("api::sub-menu.sub-menu").create({
          data: {
            label: subMenu.label,
            url: subMenu.url,
            style: subMenu?.style,
          },
        });
      }
    });

    if (releaseNotesCount) {
      await strapi.db.query("api::release-note.release-note").update({
        where: { id: 1 },
        data: {
          label: releaseNotes.label,
          location: releaseNotes.location,
        },
      });
    } else {
      await strapi.db.query("api::release-note.release-note").create({
        data: {
          label: releaseNotes.label,
          location: releaseNotes.location,
          publishedAt: new Date(),
        },
      });
    }

    if (guidesCount) {
      await strapi.db.query("api::guide.guide").update({
        where: { id: 1 },
        data: {
          label: guides.label,
          location: guides.location,
        },
      });
    } else {
      await strapi.service("api::guide.guide").create({
        data: {
          label: guides.label,
          location: guides.location,
          publishedAt: new Date(),
        },
      });
    }

    if (topNavItemCount) {
      await strapi.entityService.update("api::top-nav-item.top-nav-item", 1, {
        populate: {
          body: {
            populate: "*",
          },
        },
        data: {
          body: topNavItem.body.map((topNavItem, index) => {
            if (topNavItem.__component === "menu.links") {
              return {
                __component: "menu.links",
                label: topNavItem.label,
                url: topNavItem.url,
                publishedAt: new Date(),
              };
            } else {
              return {
                __component: "menu.dropdown",
                label: topNavItem.label,
                sub_menus: topNavItem.sub_menus.map((subMenu) => {
                  return {
                    id: subMenu.id,
                    label: subMenu.label,
                    url: subMenu.url,
                    publishedAt: new Date(),
                  };
                }),
              };
            }
          }),
        },
      });
    } else {
      await strapi.entityService.create("api::top-nav-item.top-nav-item", {
        data: {
          body: topNavItem.body.map((topNavItem, index) => {
            if (topNavItem.__component === "menu.links") {
              return {
                __component: "menu.links",
                label: topNavItem.label,
                url: topNavItem.url,
              };
            } else {
              return {
                __component: "menu.dropdown",
                label: topNavItem.label,
                sub_menus: topNavItem.sub_menus.map((subMenu) => {
                  return {
                    id: subMenu.id,
                    label: subMenu.label,
                    url: subMenu.url,
                  };
                }),
              };
            }
          }),
          publishedAt: new Date(),
        },
      });
    }
  } catch (error) {
    console.log("Error:= ", error);
  }
};
