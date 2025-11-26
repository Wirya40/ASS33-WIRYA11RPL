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

<<<<<<< HEAD
export default function StudentsPage() {
=======


function mapStudentForTable(raw) {
  return {
    id: raw.id ?? raw._id ?? raw.studentId ?? Math.random().toString(36).slice(2, 9),
    name: (raw.name ?? raw.full_name ?? raw.fullName ?? `${raw.firstName ?? ""} ${raw.lastName ?? ""}`.trim()) || "—",
    major: raw.major ?? raw.jurusan ?? raw.department ?? "—",
    class: raw.class ?? raw.kelas ?? raw.className ?? "—",
    email: raw.email ?? raw.emailAddress ?? "",
    phone: raw.phone ?? raw.telepon ?? "",
  };
}

function normalizeStudent(raw) {
  return {
    id:
      raw.id ??
      raw._id ??
      raw.studentId ??
      Math.random().toString(36).slice(2, 9),
    name:
      (raw.name ||
        raw.full_name ||
        raw.fullName ||
        `${raw.firstName || ""} ${raw.lastName || ""}`.trim()) || "—",
    major: raw.major || raw.jurusan || raw.department || "—",
    class: raw.class || raw.kelas || raw.className || "—",
    email: raw.email || raw.emailAddress || "",
    phone: raw.phone || raw.telepon || "",
  };
}



export default function StudentsQuizPage() {
>>>>>>> 3e3483afa5dc353a9d18540c782c5ca0fbeabba9
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form] = Form.useForm();
  const router = useRouter();

<<<<<<< HEAD
 
  const [search, setSearch] = useState("");

 
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);

      const sorted = [...res.data].sort((a, b) => b.id - a.id);
      setStudents(sorted);
=======
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

 
  const fetchStudents = async () => {
  setLoading(true);
  try {
  
    const data = [
      { id: "1", name: "Alice", major: "Computer Science", class: "XII RPL 1", email: "alice@gmail.com", phone: "081234567" },
      { id: "2", name: "Budi", major: "Multimedia", class: "XI MM 2", email: "budi@gmail.com", phone: "089876543" },
    ];

    setStudents(data.map(normalizeStudent));
  } catch (err) {
    console.error("Failed to fetch students:", err);
    notification.error({
      message: "Fetch error",
      description: "Could not fetch students. Using mock data.",
    });
  } finally {
    setLoading(false);
  }
};
>>>>>>> 3e3483afa5dc353a9d18540c782c5ca0fbeabba9

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

<<<<<<< HEAD
  
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

=======

  const filteredStudents = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const name = s.name.toLowerCase();
      const major = s.major.toLowerCase();
      return name.includes(q) || major.includes(q);
    });
  }, [students, searchTerm]);



  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCreateSubmit = async (values) => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 800)); 

      const newStudent = normalizeStudent({
        ...values,
        id: Math.random().toString(36).slice(2, 9),
      });

      setStudents((prev) => [newStudent, ...prev]);
      setIsModalOpen(false);
      form.resetFields();
      notification.success({
        message: "Created",
        description: `${newStudent.name} was added.`,
      });
      setCurrentPage(1);
    } catch (err) {
      console.error("Create failed:", err);
      notification.error({
        message: "Create failed",
        description: "Could not add new student.",
      });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (values) => {
    if (!editing) return;
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 800)); 

      const updatedStudent = { ...editing, ...values };
      setStudents((prev) =>
        prev.map((s) => (s.id === editing.id ? updatedStudent : s))
      );

      setIsModalOpen(false);
      setEditing(null);
      form.resetFields();
      notification.success({
        message: "Updated",
        description: `${updatedStudent.name} was updated.`,
      });
    } catch (err) {
      console.error("Update failed:", err);
      notification.error({
        message: "Update failed",
        description: "Could not update student.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 500));
      setStudents((prev) => prev.filter((s) => s.id !== record.id));
      notification.success({
        message: "Deleted",
        description: `${record.name} was deleted.`,
      });
      const totalAfter = filteredStudents.length - 1;
      const maxPage = Math.max(1, Math.ceil(totalAfter / pageSize));
      if (currentPage > maxPage) setCurrentPage(maxPage);
    } catch (err) {
      console.error("Delete failed:", err);
      notification.error({
        message: "Delete failed",
        description: "Could not delete student.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) await handleEditSubmit(values);
      else await handleCreateSubmit(values);
    } catch {
     
    }
  };

>>>>>>> 3e3483afa5dc353a9d18540c782c5ca0fbeabba9
 
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

<<<<<<< HEAD
  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
=======
 
  const totalRecords = filteredStudents.length;
  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);
>>>>>>> 3e3483afa5dc353a9d18540c782c5ca0fbeabba9

  
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

<<<<<<< HEAD
      <Button
        type="primary"
        onClick={() => openModal()}
        style={{ marginBottom: 20, marginLeft: 10 }}
=======

  <Modal
    title={editing ? `Edit ${editing.name}` : "Add new student"}
    open={isModalOpen}
    onOk={onModalOk}
    onCancel={() => {
      setIsModalOpen(false);
      setEditing(null);
      form.resetFields();
    }}
    okText={editing ? "Save" : "Create"}
    destroyOnHidden
  >
    <Form
      form={form} 
      layout="vertical"
      onFinish={editing ? handleEditSubmit : handleCreateSubmit}
      initialValues={editing || {}}
    >
      <Form.Item
        name="name"
        label="Full Name"
        rules={[{ required: true, message: "Please input name!" }]}
>>>>>>> 3e3483afa5dc353a9d18540c782c5ca0fbeabba9
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
