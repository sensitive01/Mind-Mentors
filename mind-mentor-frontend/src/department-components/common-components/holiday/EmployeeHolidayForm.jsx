import { Button, Grid, MenuItem, TextField } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createHoliday } from '../../../api/service/employee/EmployeeService';
import FileUpload from '../../../components/uploader/FileUpload';

const holidayCategories = [
    { id: 1, name: 'National Holiday' },
    { id: 2, name: 'Religious Holiday' },
    { id: 3, name: 'Cultural Holiday' },
    { id: 4, name: 'Seasonal Holiday' },
    { id: 5, name: 'Observance Day' },
    { id: 6, name: 'Organizational Holiday' },
    { id: 7, name: 'Local Holiday' },
];
const EmployeeHolidayForm = () => {
    const getCurrentYear = () => new Date().getFullYear();
    const [holidayDetails, setHolidayDetails] = useState({
        holidayName: '',
        startDate: '',
        endDate: '',
        description: '',
        attachment: '',
        category: '',
    });
    const [loading, setLoading] = useState(false);
    const handleHolidayChange = (field, value) => {
        setHolidayDetails((prevDetails) => ({
            ...prevDetails,
            [field]: value,
        }));
    };
    const handleFileUpload = (url) => {
        setHolidayDetails({ ...holidayDetails, attachment: url });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (
                holidayDetails.holidayName &&
                holidayDetails.startDate &&
                holidayDetails.endDate &&
                holidayDetails.description &&
                holidayDetails.category &&
                holidayDetails.attachment
            ) {
                await createHoliday(holidayDetails);
                toast.success('Holiday details submitted successfully!');
                setHolidayDetails({
                    holidayName: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                    attachment: '',
                    category: '',
                });
            } else {
                toast.error('Please fill in all required fields.');
            }
        } catch (error) {
            toast.error('Error while submitting holiday details. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen p-6">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Holiday Form</h2>
                        <p className="text-sm opacity-90">Please fill in the details for the holiday</p>
                    </div>
                    <Button
                        variant="contained"
                        color="#642b8f"
                        component={Link}
                        to="/holiday"
                    >
                        View Holidays
                    </Button>
                </div>
                <form className="p-8" onSubmit={handleSubmit}>
                    <div className="space-y-8">
                        <h3 className="text-[#642b8f] font-semibold text-lg pb-2 border-b-2 border-[#f8a213]">
                            Holiday Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                            <TextField
                                label="Holiday Name"
                                variant="outlined"
                                value={holidayDetails.holidayName}
                                onChange={(e) => handleHolidayChange('holidayName', e.target.value)}
                                fullWidth
                                required
                            />
                            <TextField
                                select
                                label="Category"
                                value={holidayDetails.category}
                                onChange={(e) => handleHolidayChange('category', e.target.value)}
                                fullWidth
                                required
                            >
                                {holidayCategories.map((category) => (
                                    <MenuItem key={category.id} value={category.name}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                type="date"
                                label="Start Date"
                                variant="outlined"
                                value={holidayDetails.startDate}
                                onChange={(e) => handleHolidayChange('startDate', e.target.value)}
                                fullWidth
                                InputProps={{ inputProps: { min: `${getCurrentYear()}-01-01`, max: `${getCurrentYear()}-12-31` } }}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                            <TextField
                                type="date"
                                label="End Date"
                                variant="outlined"
                                value={holidayDetails.endDate}
                                onChange={(e) => handleHolidayChange('endDate', e.target.value)}
                                fullWidth
                                InputProps={{
                                    inputProps: { min: holidayDetails.startDate || `${getCurrentYear()}-01-01` },
                                }}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                            <TextField
                                label="Description"
                                variant="outlined"
                                value={holidayDetails.description}
                                onChange={(e) => handleHolidayChange('description', e.target.value)}
                                multiline
                                rows={4}
                                fullWidth
                                required
                            />
                            <Grid item xs={12} sm={12}>
                                <FileUpload
                                    fieldName="Attachment"
                                    name="attachment"
                                    onFileUpload={handleFileUpload}
                                />
                            </Grid>
                        </div>
                    </div>
                    <div className="flex justify-center gap-6 mt-12">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
                        >
                            {loading ? 'Submitting...' : 'Submit Holiday Request'}
                        </button>
                        <button
                            type="reset"
                            className="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
                            onClick={() =>
                                setHolidayDetails({
                                    holidayName: '',
                                    startDate: '',
                                    endDate: '',
                                    description: '',
                                    attachment: null,
                                    category: '',
                                })
                            }
                        >
                            Reset Form
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default EmployeeHolidayForm;
