import React from "react";
import {
    Form,
    Select,
    Button,
    Row,
    Col,
    Space
} from "antd";

const FilterForm = ({
    fields = [],
    options = {},
    onChange
}) => {

    const [form] = Form.useForm();

    const handleValuesChange = (_, allValues) => {
        onChange(allValues);
    };

    const handleClear = () => {
        form.resetFields();
        onChange({});
    };

    return (
        <div style={{ marginBottom: 10 }}>

            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleValuesChange}
            >

                <Row gutter={[12, 0]}>

                    {fields.map((field) => (

                        <Col
                            span={6}
                            key={field.name}
                        >
                            <Form.Item
                                label={field.label}
                                name={field.name}
                            >

                                <Select
                                    mode="multiple"
                                    allowClear
                                    showSearch
                                    placeholder={`Select ${field.label}`}
                                    options={
                                        options[field.name] || []
                                    }
                                />

                            </Form.Item>
                        </Col>

                    ))}

                </Row>

                <Space>
                    <Button
                        danger
                        onClick={handleClear}
                        size= 'small'
                    >
                        Clear Filter
                    </Button>
                </Space>

            </Form>

        </div>
    );
};

export default FilterForm;