import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


// Custom ExpandMore button styled component.
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

/**
 * ChildCard Component
 * @param {Object} props
 * @param {Object} props.child - The child document to display.
 * @param {Function} props.onEdit - Callback when the edit button is clicked.
 * @param {Function} props.onDelete - Callback when the delete button is clicked.
 */
export default function ChildCard({ child, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <DynamicCard sx={{ maxWidth: 345, m: 1 }}>
      <DynamicCardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="child">
            {child.fullName ? child.fullName.charAt(0).toUpperCase() : "C"}
          </Avatar>
        }
        action={
          <>
            <IconButton aria-label="edit" onClick={() => onEdit(child)}>
              <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => onDelete(child._id)}>
              <DeleteIcon />
            </IconButton>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </>
        }
        title={child.fullName}
        subheader={child.loginEmail}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          Age: {child.age}
        </Typography>
      </CardContent>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="subtitle1">Recent Activity:</Typography>
          <Typography variant="body2" color="text.secondary">
            No recent activity.
          </Typography>
        </CardContent>
      </Collapse>
    </DynamicCard>
  );
}
