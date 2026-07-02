import React from "react";
import { Input, Select, Row, Col } from "antd";

const HeaderForm = ({
  columns,
  data,
  setData,
  dropdownConfig,
}) => {
  const hiddenFields = [
    "productspec_header_id",
  ];

  const handleChange = (
    field,
    value
  ) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Row gutter={[16, 16]}>
      {columns
        .filter(
          (c) =>
            !hiddenFields.includes(c.field)
        )
        .map((col) => {
          const dropdown =
            dropdownConfig[col.field];

          return (
            <Col
              span={8}
              key={col.field}
            >
              <div>
                <b>
                  {col.headerName}
                </b>
              </div>

              {dropdown ? (
                <Select
                  style={{
                    width: "100%",
                  }}
                  value={
                    data[col.field]
                  }
                  onChange={(value) =>
                    handleChange(
                      col.field,
                      value
                    )
                  }
                >
                  {dropdown.options.map(
                    (option) => (
                      <Select.Option
                        key={
                          option[
                            dropdown.value
                          ]
                        }
                        value={
                          option[
                            dropdown.value
                          ]
                        }
                      >
                        {
                          option[
                            dropdown.label
                          ]
                        }
                      </Select.Option>
                    )
                  )}
                </Select>
              ) : (
                <Input
                  value={
                    data[col.field]
                  }
                  onChange={(e) =>
                    handleChange(
                      col.field,
                      e.target.value
                    )
                  }
                />
              )}
            </Col>
          );
        })}
    </Row>
  );
};

export default HeaderForm;