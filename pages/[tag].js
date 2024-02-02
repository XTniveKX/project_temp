import { BreadCrumb } from "primereact/breadcrumb";
import React, { useState } from "react";
import axios from "axios";

export async function getServerSideProps({ query }) {
  const basePath = process.env.basePath || "";
  try {
    const data = await axios.get(basePath + "/api/category/get/tag", {
      params: { tag: query.tag },
    });
    if (!data.data[0]) {
      return { notFound: true };
    }

    return {
      props: { detail: data.data[0] },
    };
  } catch (error) {
    throw error;
  }
}

const TitlePage = ({ detail }) => {
  const [data, setData] = useState(detail);

  const home = { icon: "pi pi-home", url: "/" };
  const breadcrumb = [{ label: data?.category_name, url: "/" + data?.tag }];

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <BreadCrumb model={breadcrumb} home={home} />
          <h5>{data?.category_name}</h5>
          <div dangerouslySetInnerHTML={{ __html: data?.description }} />
        </div>
      </div>
    </div>
  );
};

export default TitlePage;
