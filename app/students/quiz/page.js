"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  Spin,
} from "antd";
import axios from "axios";

const API_URL = "/api/students";

export default function StudentsQuizPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

 
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");

 
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

 
  const [editModal, setEditModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);


  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

 
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setStudents(res.data);
    } catch (err) {
      message.error("Failed to load students");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

 
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchText);
      setCurrentPage(1);
    }, 300); 

    return () => clearTimeout(timer);
  }, [searchText]);

 
  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.major.toLowerCase().includes(q)
    );
  });

 
  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;

    const valA = a[sortField]?.toLowerCase() || "";
    const valB = b[sortField]?.toLowerCase() || "";

    if (sortOrder === "ascend") return valA > valB ? 1 : -1;
    if (sortOrder === "descend") return valA < valB ? 1 : -1;

    return 0;
  });

 
  const paginated = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

 
  const openEdit = (record) => {
    setEditingStudent(record);
    setEditModal(true);
  };

 
  const saveEdit = async (values) => {
    try {
      await axios.put(API_URL, {
        id: editingStudent.id,
        ...values,
      });

      message.success("Student updated successfully!");
      setEditModal(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      message.error("Failed to update student");
    }
  };


  const deleteStudent = async (id) => {
    try {
      await axios.delete(API_URL, { data: { id } });
      message.success("Student deleted!");
      fetchStudents();
    } catch (err) {
      message.error("Failed to delete student");
    }
  };

 
  const handleSort = (field) => {
    const order =
      sortField === field && sortOrder === "ascend"
        ? "descend"
        : "ascend";

    setSortField(field);
    setSortOrder(order);
  };

 
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("name"),
      }),
    },
    {
      title: "Major",
      dataIndex: "major",
    },
    {
      title: "Class",
      dataIndex: "class",
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort("class"),
      }),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => openEdit(record)}
            className="mr-2"
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete student?"
            onConfirm={() => deleteStudent(record.id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <section className="p-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-5">Students Quiz</h1>

     
      <Input
        placeholder="Search by name or major..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="mb-4"
        allowClear
      />

     
      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={paginated}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: sorted.length,
            onChange: (page) => setCurrentPage(page),
          }}
        />
      )}

    
      <Modal
        open={editModal}
        onCancel={() => setEditModal(false)}
        onOk={() => document.getElementById("editFormSubmit").click()}
        title="Edit Student"
      >
        <Form
          initialValues={editingStudent || {}}
          onFinish={saveEdit}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="major"
            label="Major"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="class"
            label="Class"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <button id="editFormSubmit" type="submit" hidden />
        </Form>
      </Modal>
    </section>
  );
}
