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
import { useRouter } from "next/navigation";

const API_URL = "/api/students";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form] = Form.useForm();
  const router = useRouter();

 
  const [search, setSearch] = useState("");

 
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);

      const sorted = [...res.data].sort((a, b) => b.id - a.id);
      setStudents(sorted);

      message.success("Students loaded successfully");
    } catch (error) {
      console.error("Fetch Error:", error);
      message.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  
  const filteredStudents = students.filter((s) => {
  const q = search.toLowerCase();
  return (
    (s.name || "").toLowerCase().includes(q) ||
    (s.nis || "").toLowerCase().includes(q) ||
    (s.major || "").toLowerCase().includes(q) ||
    (s.class_name || "").toLowerCase().includes(q)
  );
});


 
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingStudent) {
        try {
          await axios.put(API_URL, { id: editingStudent.id, ...values });
          message.success("Student updated successfully");
          await fetchStudents();
        } catch (error) {
          setStudents((prev) =>
            prev.map((s) =>
              s.id === editingStudent.id ? { ...s, ...values } : s
            )
          );
          message.warning("API update failed — updated locally instead");
        }
      } else {
        try {
          await axios.post(API_URL, values);
          message.success("Student added successfully");
          await fetchStudents();
        } catch (error) {
          const newId = Math.max(...students.map((s) => s.id), 0) + 1;
          setStudents((prev) => [{ id: newId, ...values }, ...prev]);
          message.warning("API add failed — added locally instead");
        }
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Save Error:", error);
      message.error("Failed to save student");
    }
  };

  
  const handleDelete = async (id) => {
    try {
      await axios.delete(API_URL, { data: { id } });
      message.success("Student deleted successfully");
      fetchStudents();
    } catch (error) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
      message.warning("API delete failed — deleted locally instead");
    }
  };

 
  const openModal = (student = null) => {
    setEditingStudent(student);
    form.resetFields();
    if (student) form.setFieldsValue(student);
    setIsModalOpen(true);
  };

 
  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "NIS", dataIndex: "nis" },
    { title: "Name", dataIndex: "name" },
    { title: "Class", dataIndex: "class_name" },
    { title: "Major", dataIndex: "major" },
    { title: "Status", dataIndex: "status" },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger type="link">
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );

  
  return (
    <div style={{ padding: 24 }}>
      <h1>Data Murid</h1>

     
      <Input
        placeholder="Search name, NIS, class, major..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 15, width: 300 }}
        allowClear
      />

      <Button
        type="primary"
        onClick={() => openModal()}
        style={{ marginBottom: 20, marginLeft: 10 }}
      >
        Add Student
      </Button>

      <Table
        columns={columns}
        dataSource={filteredStudents}
        rowKey="id"
        bordered
        pagination={{ pageSize: 6 }}
      />

      <Modal
        title={editingStudent ? "Edit Student" : "Add Student"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="nis" label="NIS" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="class_name"
            label="Class"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="major" label="Major" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
