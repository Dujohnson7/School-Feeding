import React from 'react';
import { format as formatDate } from 'date-fns';

export interface ReportTemplateProps {
    title: string;
    from: Date | string;
    to: Date | string;
    generatorDate?: Date | string;
    type: 'school' | 'stock' | 'district' | 'supplier' | 'gov';
    entityInfo: {
        name?: string;
        province?: string;
        district?: string;
        supplierName?: string;
    };
    columns: string[];
    rows: any[][];
}

const ReportTemplate: React.FC<ReportTemplateProps> = ({
    title,
    from,
    to,
    generatorDate = new Date(),
    type,
    entityInfo,
    columns,
    rows,
}) => {
    const formatValue = (date: Date | string) => {
        if (date instanceof Date) return formatDate(date, 'd MMMM yyyy');
        return date;
    };

    const renderEntityInfo = () => {
        switch (type) {
            case 'school':
            case 'stock':
                return (
                    <div className="space-y-1">
                        <p className="text-red-600 font-bold">
                            School: <span className="text-black font-normal">{entityInfo.name}</span>
                        </p>
                        <p className="text-[#1a365d] font-bold">
                            Province: <span className="text-black font-normal">{entityInfo.province}</span>
                        </p>
                        <p className="text-[#2e7d32] font-bold">
                            District: <span className="text-black font-normal">{entityInfo.district}</span>
                        </p>
                    </div>
                );
            case 'district':
                return (
                    <div className="space-y-1">
                        <p className="text-[#1a365d] font-bold">
                            Province: <span className="text-black font-normal">{entityInfo.province}</span>
                        </p>
                        <p className="text-[#2e7d32] font-bold">
                            District: <span className="text-black font-normal">{entityInfo.district}</span>
                        </p>
                    </div>
                );
            case 'supplier':
                return (
                    <div className="space-y-1">
                        <p className="text-red-600 font-bold">
                            Supplier: <span className="text-black font-normal">{entityInfo.supplierName}</span>
                        </p>
                        <p className="text-[#1a365d] font-bold">
                            Province: <span className="text-black font-normal">{entityInfo.province}</span>
                        </p>
                        <p className="text-[#2e7d32] font-bold">
                            District: <span className="text-black font-normal">{entityInfo.district}</span>
                        </p>
                    </div>
                );
            case 'gov':
                return (
                    <div className="space-y-1">
                        <p className="text-red-600 font-bold">
                            <span className="text-black font-normal">MINEDUC</span>
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white text-sm font-serif">
            {/* Header Section */}
            <div className="flex flex-col items-start mb-6 w-fit mx-auto">
                <div className="flex flex-col items-center">
                    <img src="/logoSF.png" alt="Logo" className="w-24 h-32 mb-2 object-contain" />
                    <h1 className="text-[#2b6cb0] text-xl font-bold tracking-wider mb-6">SCHOOL FEEDING</h1>
                </div>

                {renderEntityInfo()}

                <div className="mt-4 flex gap-8">
                    <p className="text-[#c05621] font-bold">
                        From: <span className="text-black font-normal">{formatValue(from)}</span>
                    </p>
                    <p className="text-[#c05621] font-bold">
                        To: <span className="text-black font-normal">{formatValue(to)}</span>
                    </p>
                </div>
            </div>

            {/* Report Title */}
            <div className="text-center my-6">
                <h2 className="text-[#4a6785] text-lg font-bold uppercase tracking-wide">{title}</h2>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-400">
                    <thead>
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className="border border-gray-400 p-3 text-left bg-[#f8f9fa] font-bold text-gray-800">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIdx) => (
                            <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}>
                                {row.map((cell, cellIdx) => (
                                    <td key={cellIdx} className="border border-gray-400 p-3 text-gray-700">
                                        {typeof cell === 'object' && cell !== null ? JSON.stringify(cell) : String(cell ?? '')}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Section */}
            <div className="text-center mt-12 italic text-black">
                Generator on {formatValue(generatorDate)}
            </div>
        </div>
    );
};

export default ReportTemplate;
