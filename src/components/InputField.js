import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const InputField = ({ label, value, onChange, placeholder, helpText }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center">
                    <span>{label}</span>
                    {helpText && (
                        <div className="group relative ml-2 cursor-pointer">
                            <InformationCircleIcon className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                            <div className="absolute hidden group-hover:block bg-white p-2 border rounded-md shadow-md text-xs text-gray-600 w-64 z-50">
                                {helpText}
                            </div>
                        </div>
                    )}
                </div>
                <input
                    type="password"
                    value={value}
                    onChange={onChange}
                    className="w-full p-2 border rounded-md mt-1"
                    placeholder={placeholder}
                />
            </label>
        </div>
    );
}

export default InputField;