"use client";

import React, { useEffect, useState } from "react";
import { Card, Button, Spin, message } from "antd";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_URL = "/api/students";

export default function StudentDetail({ params }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [id, setId] = useState(null);
  useEffect(() => {
    Promise.resolve(params).then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    const fetchStudent = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API_URL);
        const found = res.data.find((s) => s.id == id);
        setStudent(found);
      } catch (error) {
        console.error("Fetch Error:", error);
        message.error("Failed to fetch student");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );

  if (!student)
    return (
      <div style={{ padding: 24 }}>
        <p>No student found.</p>
        <Button onClick={() => router.back()}>Back</Button>
      </div>
    );

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={`Student Detail: ${student.name}`}
        style={{ width: 400, marginBottom: 20 }}
      >
        <p><strong>ID:</strong> {student.id}</p>
        <p><strong>NIS:</strong> {student.nis}</p>
        <p><strong>Class:</strong> {student.class_name}</p>
        <p><strong>Major:</strong> {student.major}</p>
        <p><strong>Status:</strong> {student.status}</p>
      </Card>
      <Button type="primary" onClick={() => router.back()}>
        Back
      </Button>
    </div>
  );
}