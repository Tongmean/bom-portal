import React from 'react';
import { Select, Row, Col, Typography } from 'antd';

const { Text } = Typography;

const GenericFilterDropdowns = ({ data = [], fields = [], filters = {}, onFilterChange }) => {
    // Dynamically calculate options based on OTHER selected filters (Dependent Dropdowns)
    const getOptionsForField = (targetFieldName) => {
        // Filter the raw data using all current selections EXCEPT the current target field
        const relevantData = data.filter((row) => {
            return fields.every((field) => {
                if (field.name === targetFieldName) return true; // Ignore self
                const selectedValues = filters[field.name];
                if (!selectedValues || selectedValues.length === 0) return true; // No filter applied
                return selectedValues.includes(row[field.name]);
            });
        });

        // Extract unique, non-null values for the target field
        const uniqueValues = [...new Set(relevantData.map((row) => row[targetFieldName]))]
            .filter(val => val !== null && val !== undefined);

        return uniqueValues.map((val) => ({
            label: String(val),
            value: val,
        }));
    };

    return (
        <Row gutter={[16, 16]}>
            {fields.map((field) => {
                const options = getOptionsForField(field.name);

                return (
                    <Col xs={24} sm={12} md={8} lg={6} key={field.name}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <Text strong style={{ fontSize: '13px' }}>{field.label}</Text>
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder={`Select ${field.label}`}
                                value={filters[field.name] || []}
                                options={options}
                                onChange={(values) => onFilterChange(field.name, values)}
                            />
                        </div>
                    </Col>
                );
            })}
        </Row>
    );
};

export default GenericFilterDropdowns;