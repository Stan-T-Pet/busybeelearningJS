// File: src/pages/admin/dataloader.js

import React, { useEffect, useState } from "react";
import {
  Container, Typography, MenuItem, Select, Box, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Checkbox, FormControlLabel, Button, Grid, TextField
} from "@mui/material";
import AdminLayout from "../../components/Layouts/AdminLayout";
import { loadData } from "../../utils/dataLoader";
import axios from "axios";

const CONTENT_TYPES = ["course", "lesson", "quiz"];

export default function DataLoaderPage() {
  const [fileOptions, setFileOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedType, setSelectedType] = useState("course");
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [excludedCols, setExcludedCols] = useState({});
  const [courseId, setCourseId] = useState("");
  const [courseList, setCourseList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  // Load file names
  useEffect(() => {
    axios.get("/api/admin/files")
      .then((res) => {
        const files = res.data.files || [];
        setFileOptions(files);
        if (files.length > 0) setSelectedFile(files[0]);
      })
      .catch(err => console.error("Failed to load file list", err));
  }, []);

  // Load available courses for linking
  useEffect(() => {
    if (selectedType === "lesson" || selectedType === "quiz") {
      axios.get("/api/admin/courses")
        .then((res) => setCourseList(res.data?.courses || []))
        .catch(err => console.error("Error loading courses", err));
    }
  }, [selectedType]);

  // Load and initialize data
  useEffect(() => {
    const fetch = async () => {
      try {
        const loaded = await loadData(selectedFile);
        if (!Array.isArray(loaded) || loaded.length === 0) {
          console.warn("Empty or invalid file:", selectedFile);
          setData([]);
          return;
        }

        const cols = Object.keys(loaded[0]);
        setColumns(cols);
        setData(loaded);

        const exclusions = {};
        cols.forEach((key) => (exclusions[key] = false));
        setExcludedCols(exclusions);
      } catch (err) {
        console.error("Failed to load data:", err);
        setData([]);
      }
    };

    if (selectedFile) fetch();
  }, [selectedFile]);

  // Column rename
  const renameColumn = (index, newName) => {
    const oldName = columns[index];
    if (!newName || oldName === newName) return;

    const updatedColumns = [...columns];
    updatedColumns[index] = newName;

    const updatedData = data.map(row => {
      const newRow = { ...row, [newName]: row[oldName] };
      delete newRow[oldName];
      return newRow;
    });

    setColumns(updatedColumns);
    setData(updatedData);

    const updatedExclusions = { ...excludedCols };
    updatedExclusions[newName] = updatedExclusions[oldName];
    delete updatedExclusions[oldName];
    setExcludedCols(updatedExclusions);
  };

  const updateCell = (rowIdx, col, value) => {
    const updated = [...data];
    updated[rowIdx][col] = value;
    setData(updated);
  };

  const handleExcludeToggle = (key) => {
    setExcludedCols((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    const cleaned = data
      .map(row => {
        const copy = {};
        for (let key in row) {
          if (!excludedCols[key]) copy[key] = row[key];
        }
        if (selectedType !== "course") copy.courseId = courseId;
        return copy;
      })
      .filter(obj => Object.keys(obj).length > 0);

    if (cleaned.length === 0) {
      alert("No valid data to import.");
      return;
    }

    try {
      const res = await axios.post(`/api/admin/import/${selectedType}`, { data: cleaned });
      alert(`Imported ${res.data.count} records successfully.`);
    } catch (err) {
      console.error("Import failed:", err?.response?.data || err);
      alert("Import failed. See console for details.");
    }
  };

  return (
    <AdminLayout>
      <Container>
        <Typography variant="h4" gutterBottom align="center">Data Import & Loader</Typography>

        <Box sx={{ my: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography>Data Type:</Typography>
              <Select value={selectedType} fullWidth onChange={(e) => setSelectedType(e.target.value)}>
                {CONTENT_TYPES.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
              </Select>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography>File:</Typography>
              <Select value={selectedFile} fullWidth onChange={(e) => setSelectedFile(e.target.value)}>
                {fileOptions.map(file => <MenuItem key={file} value={file}>{file}</MenuItem>)}
              </Select>
            </Grid>

            {["lesson", "quiz"].includes(selectedType) && (
              <Grid item xs={12} md={4}>
                <Typography>Link to Course:</Typography>
                <Select value={courseId} fullWidth onChange={(e) => setCourseId(e.target.value)}>
                  {courseList.map(course => (
                    <MenuItem key={course._id} value={course._id}>{course.title}</MenuItem>
                  ))}
                </Select>
              </Grid>
            )}
          </Grid>
        </Box>

        {data.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 3 }}>Preview & Edit</Typography>

            {/* Column rename / exclusion */}
            <Box display="flex" flexWrap="wrap" gap={2} my={2}>
              {columns.map((col, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={!excludedCols[col]}
                      onChange={() => handleExcludeToggle(col)}
                    />
                  }
                  label={
                    <TextField
                      size="small"
                      value={col}
                      onChange={(e) => renameColumn(index, e.target.value)}
                    />
                  }
                />
              ))}
            </Box>

            {/* Editable Table */}
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {columns.map((col) =>
                      !excludedCols[col] ? <TableCell key={col}>{col}</TableCell> : null
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(0, 10).map((row, rowIdx) => (
                    <TableRow key={rowIdx}>
                      {columns.map((col) =>
                        !excludedCols[col] ? (
                          <TableCell key={col}>
                            <TextField
                              value={row[col] ?? ""}
                              onChange={(e) => updateCell(rowIdx, col, e.target.value)}
                              fullWidth
                            />
                          </TableCell>
                        ) : null
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box textAlign="center" mt={4}>
              <Button variant="contained" color="success" onClick={handleSave}>
                Save to MongoDB
              </Button>
            </Box>
          </>
        )}
      </Container>
    </AdminLayout>
  );
}