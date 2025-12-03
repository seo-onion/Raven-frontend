import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Main.css";
import "../Home/Home.css";

// Core layout components
import Navbar from "@/components/common/Navbar/Navbar";
import Footer from "../../components/common/Footer/Footer";

// Components from Home.tsx (Showcase)
import Button from '@/components/common/Button/Button'
import Card from '@/components/common/Card/Card'
import CardTitle from '@/components/common/Card/CardTitle'
import Paginator from '@/components/common/Paginator/Paginator'
import Spinner from '@/components/common/Spinner/Spinner'
import { Table } from '@/components/common/Table/Table'
import { TableHeader } from '@/components/common/Table/TableHeader'
import { TableBody } from '@/components/common/Table/TableBody'
import { TableRow } from '@/components/common/Table/TableRow'
import { TableCell } from '@/components/common/Table/TableCell'
import { TableColumn } from '@/components/common/Table/TableColumn'
import UserAvatar from '@/components/common/UserAvatar/UserAvatar'
import DatePicker from '@/components/forms/DatePicker/DatePicker'
import DateTimePicker from '@/components/forms/DateTimePicker/DateTimePicker'
import FileUpload from '@/components/forms/FileUpload/FileUpload'
import Input from '@/components/forms/Input/Input'
import PasswordEyeInput from '@/components/forms/PasswordEyeInput/PasswordEyeInput'
import Select from '@/components/forms/Select/Select'
import LanguageToggle from '@/components/general/LanguageToggle/LanguageToggle'
import ThemeToggle from '@/components/general/ThemeToggle/ThemeToggle'

const Main = () => {
    const { t } = useTranslation('common');

    // State from Home.tsx
    const [textInput, setTextInput] = useState('')
    const [emailInput, setEmailInput] = useState('')
    const [passwordInput, setPasswordInput] = useState('')
    const [textareaInput, setTextareaInput] = useState('')
    const [selectValue, setSelectValue] = useState('option1')
    const [dateValue, setDateValue] = useState<Date | null>(null)
    const [dateTimeValue, setDateTimeValue] = useState('')
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)

    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const selectOptions = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
    ]

    const tableData = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Moderator' },
    ]

    const handleLoadingToggle = () => {
        setIsLoading(!isLoading)
        if (!isLoading) {
            setTimeout(() => setIsLoading(false), 3000)
        }
    }

    return (
        <div className="main-app-container">
            <Navbar />
            <div className="main-content-wrapper">
                {/* Showcase Section from Home.tsx */}
                <div className="home_container" style={{ padding: "2rem", background: "var(--bg-secondary)" }}>
                    {/* Header Section */}
                    <section className="home_header">
                        <div className="home_header_content">
                            <h1 className="home_title">{t('home_hero_title')}</h1>
                            <p className="home_subtitle">{t('home_hero_subtitle')}</p>
                            <div className="home_header_controls">
                                <ThemeToggle size="lg" />
                                <LanguageToggle />
                            </div>
                        </div>
                    </section>

                    {/* Button Components Section */}
                    <section className="home_section">
                        <Card className="home_showcase_card">
                            <CardTitle>{t('home_button_components')}</CardTitle>
                            <div className="home_component_grid">
                                <div className="home_component_group">
                                    <h4>{t('home_button_variants')}</h4>
                                    <div className="home_button_group">
                                        <Button variant="primary">{t('primary')}</Button>
                                        <Button variant="secondary">{t('secondary')}</Button>
                                        <Button variant="danger">{t('danger')}</Button>
                                        <Button variant="warning">{t('warning')}</Button>
                                        <Button variant="info">{t('info')}</Button>
                                        <Button variant="success">{t('success')}</Button>
                                    </div>
                                </div>
                                <div className="home_component_group">
                                    <h4>{t('home_button_sizes')}</h4>
                                    <div className="home_button_group">
                                        <Button size="sm">{t('small')}</Button>
                                        <Button size="md">{t('medium')}</Button>
                                        <Button size="lg">{t('large')}</Button>
                                        <Button size="xl">{t('extra_large')}</Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </section>

                    {/* Form Components Section */}
                    <section className="home_section">
                        <Card className="home_showcase_card">
                            <CardTitle>{t('home_form_components')}</CardTitle>
                            <div className="home_form_grid">
                                <div className="home_form_column">
                                    <Input
                                        name="text-input"
                                        label={t('text_label')}
                                        value={textInput}
                                        setValue={setTextInput}
                                        placeholder={t('text_placeholder')}
                                        variant="bordered"
                                    />
                                    <Input
                                        name="email-input"
                                        label={t('email_label')}
                                        type="email"
                                        value={emailInput}
                                        setValue={setEmailInput}
                                        placeholder={t('email_placeholder')}
                                        variant="flat"
                                    />
                                    <PasswordEyeInput
                                        name="password-input"
                                        label={t('password_label')}
                                        value={passwordInput}
                                        setValue={setPasswordInput}
                                        placeholder={t('password_placeholder')}
                                    />
                                    <Input
                                        name="textarea-input"
                                        label={t('text_label')}
                                        value={textareaInput}
                                        setValue={setTextareaInput}
                                        placeholder={t('text_placeholder')}
                                        multiline
                                        rows={4}
                                        variant="bordered"
                                    />
                                </div>
                                <div className="home_form_column">
                                    <Select
                                        label={t('select_label')}
                                        placeholder={t('select_label')}
                                        value={selectValue}
                                        onChange={(e) => setSelectValue(e.target.value)}
                                        options={selectOptions}
                                    />
                                    <DatePicker
                                        label={t('date_label')}
                                        value={dateValue}
                                        onChange={setDateValue}
                                        placeholderText={t('date_placeholder')}
                                    />
                                    <DateTimePicker
                                        name="datetime-input"
                                        label={t('datetime_label')}
                                        value={dateTimeValue}
                                        setValue={setDateTimeValue}
                                    />
                                    <FileUpload
                                        name="file-upload"
                                        label={t('file_label')}
                                        file={uploadedFile}
                                        setFile={setUploadedFile}
                                        accept=".pdf,.doc,.docx,image/*"
                                        maxSizeMB={5}
                                        description={t('file_placeholder')}
                                    />
                                </div>
                            </div>
                        </Card>
                    </section>
                    {/* Data Display Components */}
                    <section className="home_section">
                        <Card className="home_showcase_card">
                            <CardTitle>{t('home_data_components')}</CardTitle>
                            <div className="home_component_grid">
                                <div className="home_component_group">
                                    <h4>{t('home_user_avatar')}</h4>
                                    <UserAvatar
                                        firstName="John"
                                        lastName="Doe"
                                        email="john.doe@example.com"
                                        isLoading={isLoading}
                                    />
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={handleLoadingToggle}
                                    >
                                        {t('home_toggle_loading')}
                                    </Button>
                                </div>
                                <div className="home_component_group">
                                    <h4>{t('home_spinner')}</h4>
                                    <div className="home_spinner_group">
                                        <Spinner variant="primary" size="sm" />
                                        <Spinner variant="primary" size="md" />
                                        <Spinner variant="primary" size="lg" />
                                        <Spinner variant="secondary" size="md" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </section>

                    {/* Table Component */}
                    <section className="home_section">
                        <Card className="home_showcase_card">
                            <CardTitle>{t('home_table_components')}</CardTitle>
                            <Table aria-label="Sample data table" radius={8}>
                                <TableHeader>
                                    <TableColumn>ID</TableColumn>
                                    <TableColumn>{t('name_label')}</TableColumn>
                                    <TableColumn>{t('email_label')}</TableColumn>
                                    <TableColumn>{t('role')}</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {tableData.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>{row.role}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </section>

                    {/* Paginator Component */}
                    <section className="home_section">
                        <Card className="home_showcase_card">
                            <CardTitle>{t('home_paginator_components')}</CardTitle>
                            <div className="home_component_group">
                                <Paginator
                                    page={currentPage}
                                    numPages={10}
                                    onPageChange={setCurrentPage}
                                    size="md"
                                    variant="rounded"
                                    showEdges={true}
                                />
                                <p className="home_current_page">{t('current_page')}: {currentPage}</p>
                            </div>
                        </Card>
                    </section>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Main;