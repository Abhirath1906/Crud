"use client";
import { useEffect, useState } from "react";
import { Layout, Menu, Divider, Table, Button, Modal, Form, Input, Select, message } from "antd";
import { MenuOutlined, PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import "./styles/global.css";

const { Header, Content, Sider } = Layout;

export default function Home() {
  const [open, setOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/students", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();

      setStudents(data.body?.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      message.error("Gagal mengambil data siswa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Gagal menambah data siswa");

      message.success("Siswa berhasil ditambahkan!");
      setIsModalOpen(false);
      form.resetFields();
      fetchStudents();
    } catch (error) {
      console.error("Submit error:", error);
      message.error("Gagal menambah siswa");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "NIS", dataIndex: "nis", key: "nis" },
    { title: "Class", dataIndex: "class_name", key: "class_name" },
    { title: "Major", dataIndex: "major", key: "major" },
  ];

  return (
    <Layout>
    
      <Sider
        style={{ backgroundColor: "black", color: "white", height: "150vh" }}
        collapsed={!open}
      >
        <Menu
          theme="dark"
          mode="inline"
          items={[{ key: "1", label: <Link href="/">Home</Link> }]}
          style={{ backgroundColor: "black", marginTop: "100px", padding: "40px" }}
        />
      </Sider>

      
      <Layout>
        <Header style={{ backgroundColor: "black", color: "white" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
            <MenuOutlined onClick={() => setOpen(!open)} style={{ fontSize: "30px" }} />
            <p style={{ fontSize: "40px" }}>ABBYY</p>
          </div>
        </Header>

        <Content style={{ padding: "50px" }}>
          <div>
            <p style={{ fontSize: "50px" }}>Student List</p>
            <Divider />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
              style={{ marginBottom: "20px" }}
            >
              Add Student
            </Button>

            <Table
              dataSource={students}
              columns={columns}
              rowKey="id"
              loading={loading}
              bordered
            />

            
            <Modal
              title="Add New Student"
              open={isModalOpen}
              onCancel={() => setIsModalOpen(false)}
              onOk={handleSubmit}
              okText="Submit"
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: "Masukkan nama siswa" }]}
                >
                  <Input placeholder="Nama siswa" />
                </Form.Item>

                <Form.Item
                  label="NIS"
                  name="nis"
                  rules={[{ required: true, message: "Masukkan NIS siswa" }]}
                >
                  <Input placeholder="NIS siswa" />
                </Form.Item>

                <Form.Item
                  label="Class"
                  name="class_name"
                  rules={[{ required: true, message: "Pilih kelas siswa" }]}
                >
                  <Select placeholder="Pilih kelas">
                    <Select.Option value="X RPL 1">X RPL 1</Select.Option>
                    <Select.Option value="X RPL 2">X RPL 2</Select.Option>
                    <Select.Option value="X RPL 3">X RPL 3</Select.Option>
                    <Select.Option value="X RPL 4">X RPL 4</Select.Option>
                    <Select.Option value="X RPL 5">X RPL 5</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Major"
                  name="major"
                  rules={[{ required: true, message: "Masukkan jurusan" }]}
                >
                  <Input placeholder="Rekayasa Perangkat Lunak" />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
