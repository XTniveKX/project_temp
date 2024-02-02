import axios from "axios";
import React, { useEffect, useState } from "react";

const CardItem = ({ title, url }) => (
  <div className="col-12 lg:col-6 xl:col-3">
    <div
      className="card m-5 hover:shadow-3 border-round-sm cursor-pointer"
      onClick={() => (window.location.href = url)}
    >
      <div className="flex justify-content-center">
        <div className="text-900 font-medium text-xl">{title}</div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [list, setList] = useState([]);
  const loadData = async () => {
    try {
      const cat = await axios.get("/api/category/get");
      setList(cat.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-5">
      <div className="grid">
        {list.map((item, index) => (
          <CardItem
            title={item.category_name}
            url={"/" + item.tag}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page) {
  return <React.Fragment>{page}</React.Fragment>;
};
export default Dashboard;
