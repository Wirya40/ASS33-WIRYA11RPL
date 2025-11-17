"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Modal,
  Form,
  Spin,
  Popconfirm,
  notification,
  Pagination,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const API_BASE = "https://course.summitglobal.id/students";



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
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  
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


  useEffect(() => {
    fetchStudents();
  }, []);

  
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

  
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Major",
      dataIndex: "major",
      key: "major",
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
      sorter: (a, b) => a.class.toString().localeCompare(b.class.toString()),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["md"],
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      responsive: ["lg"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => startEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title={`Delete ${record.name}?`}
            onConfirm={() => handleDelete(record)}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

 
  const totalRecords = filteredStudents.length;
  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ marginBottom: 8 }}>Student Management — Quiz</h1>

      <Space
        style={{
          marginBottom: 12,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            placeholder="Search by name or major..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            prefix={<SearchOutlined />}
            allowClear
            style={{ minWidth: 260 }}
          />
          <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>
            Add Student
          </Button>
          <Button onClick={fetchStudents}>Refresh</Button>
        </div>

        <div>
          <strong>Total:</strong> {totalRecords}
        </div>
      </Space>

      <Spin spinning={loading} tip="Loading students...">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={pagedData}
          pagination={false}
          bordered
          size="middle"
          locale={{ emptyText: loading ? "Loading..." : "No students found." }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 12,
            alignItems: "center",
          }}
        >
          <div>
            <span style={{ marginRight: 12 }}>
              Page size:
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{ marginLeft: 8 }}
              >
                {[5, 8, 12, 20].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </span>
          </div>

          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalRecords}
            onChange={(page, pSize) => {
              setCurrentPage(page);
              if (pSize && pSize !== pageSize) setPageSize(pSize);
            }}
            showSizeChanger={false}
          />
        </div>
      </Spin>

     


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
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="major"
        label="Major"
        rules={[{ required: true, message: "Please input major!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="class" label="Class">
        <Input />
      </Form.Item>

      <Form.Item name="email" label="Email">
        <Input />
      </Form.Item>

      <Form.Item name="phone" label="Phone">
        <Input />
      </Form.Item>
    </Form>
  </Modal>


    </div>
  );
}
