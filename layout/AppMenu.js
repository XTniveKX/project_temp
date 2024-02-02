import React, { useContext, useEffect, useState } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import { useRouter } from "next/router";
import axios from "axios";

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);
  const router = useRouter();
  const { asPath, query } = router;

  const [tagTitle, setTagTitle] = useState();
  const [itemList, setItemList] = useState([]);

  const getData = async (tag) => {
    try {
      const title = await axios.get("/api/category/get/tag", {
        params: { tag: tag },
      });
      setTagTitle(title.data[0].category_name);
      const list = await axios.get("/api/item/get/tag", {
        params: { tag: tag },
      });
      setItemList(list.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.open(url, "_self");
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  useEffect(() => {
    const { tag } = query;

    if (tag) {
      getData(tag);
    }
  }, [query]);

  const result = [];

  if (asPath.includes("/auth/admin")) {
    result.push({
      label: "Admin",
      items: [
        // { label: "User", to: "/auth/admin/user" },
        { label: "Category", to: "/auth/admin/category" },
        { label: "Item", to: "/auth/admin/item" },
      ],
    });
  } else {
    result.push({
      label: tagTitle,
      items: itemList.map((item) => ({
        label: item.item_name,
        to: `/${item.tag}/${item.slug}`,
      })),
    });
  }

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {/* {model.map((item, i) => {
          if (url.includes(item.tag)) {
            return !item.seperator ? (
              <AppMenuitem item={item} root={true} index={i} key={item.label} />
            ) : (
              <li className="menu-separator"></li>
            );
          }
        })} */}
        {result.map((item, i) => {
          return !item.seperator ? (
            <AppMenuitem item={item} root={true} index={i} key={item.label} />
          ) : (
            <li className="menu-separator"></li>
          );
        })}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;
