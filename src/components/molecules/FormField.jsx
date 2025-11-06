import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required, 
  className,
  options = [],
  ...props 
}) => {
  const renderInput = () => {
    if (type === "select") {
      return (
        <Select {...props} className={cn(error && "border-error")}>
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      );
    }

    if (type === "textarea") {
      return <Textarea {...props} className={cn(error && "border-error")} />;
    }

    return <Input type={type} {...props} className={cn(error && "border-error")} />;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {renderInput()}
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
};

export default FormField;