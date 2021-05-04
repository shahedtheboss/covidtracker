import React from "react";
import "./InfoBox.css";
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({ title, cases, active, total, ...props }) {
  return (
    <div>
      <Card
        onClick={props.onClick}
        className={`info_box ${active && "info_box--selected"}`}
      >
        <CardContent>
          <Typography className="info_box_title" color="textSecondary">
            {title}
          </Typography>

          <h2 className="info_box_cases">{cases}</h2>

          <Typography className="info_box_total" color="textSecondary">
            {total}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default InfoBox;
