import React from "react";
import { Result, Button } from "antd";

const index = () => {

    return(
      <div style={{width:'100%',height:'100%',textAlign:'center'}}>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={<Button type="primary">Back Home</Button>}
        />
      </div>
    )
}

export default index;
