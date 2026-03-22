import { useState, type FormEvent, type ChangeEvent } from "react";

interface FormState{
    fullName: string;
    email: string;
    birthDate: string;
    experienceYears: number | "";
    password:string;
    confirmPassword: string;
}
interface FormErrors {
  fullName?: string;
  email?: string;
  birthDate?: string;
  experienceYears?: string;
  password?: string;
  confirmPassword?: string;
}
const UserForm: React.FC =()=>{
    const [formData, setFormData] = useState<FormState>({
    fullName: "",
    email: "",
    birthDate: "",
    experienceYears: "",
    password:"",
    confirmPassword: "" 
    })
    const [errors, setErrors] = useState<FormErrors>({});

 const handleChange =(e: ChangeEvent<HTMLInputElement>)=>{
   const { name, value,type } = e.target;
   const finalValue = type === "number" ? (value === "" ? "" : Number(value)):value;

   const updatedData = {...formData,[name]: finalValue};
   setFormData(updatedData);

   const errorMsg = validate(name,finalValue,updatedData);
   setErrors((prev)=>({...prev, [name]: errorMsg}));
};

const validate =(name: string, value:any, allValues: FormState): string =>{

    //universal requird check
    if(value === undefined || value === null || value === ""){
        return "This field is required";
    }
    // specific format/logic validation
   switch(name){
    case "fullName":
        return value.trim().length < 3
        ? "Full name must be atleast 3 characters." : "";
    case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;   
        return !emailRegex.test(value) ? "Enter a valid email address." : "";
    case "birthDate":
        return !value ? "Please select your birthDate." : "";
    case "experienceYears":
        return value <=0 ? "Experience cannot be negative or zero.": "";
    case "password":
        const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;               
        return !passwordRegex.test(value)
        ? "Password must be 8-20 chaters with a letter,number, and a special character." : "";
    case "confirmPassword":
        return value !== allValues.password ? "Password do not match.": "";
    default:
        return "";          
   }
}

const handleSubmit =(e: FormEvent) =>{
    e.preventDefault();
    const validationResults: FormErrors = {};
  
  // validate all fields on submit
  (Object.keys(formData) as Array<keyof FormState>).forEach((key) => {
    const msg = validate(key, formData[key], formData);
    if (msg) validationResults[key] = msg;
  });
  if(Object.keys(validationResults).length >0){
    setErrors(validationResults);
    return;
  }
  const maskedData = {
    ...formData,
    password: "********",
    confirmPassword: "********",
  };
  console.log("Form Data (Masked) ", maskedData);
  alert("Form Data submitted successfully, some fields are masked" );
}

const inputClass =(fieldName: keyof FormErrors)=>`
    w-full px-4 py-2 mt-1 border rounded-lg outline-none transition-all duration-200 duration-block
     ${
        errors[fieldName]
        ? "border-red-600 bg-red-50 focus:ring-2 focus-ring-red-200"
        : "border-grey-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
     }
`;

    return (
      // applying tailwind classes
      <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 sm:p-10 border border-gray-100">
          <header className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-rose-950">Sign Up</h2>
            <p className="text-gray-600 mt-2 text-sm">
              All fields are required
            </p>
          </header>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/*Full name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 ml-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={inputClass("fullName")}
                placeholder="John Smith"
              />
              {errors.fullName && (
                <p className="text-xs text-red-600 mt-1 font-bold ml-1">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/*Email */}
            <div>
              <label className="block text-sm font-bold text-gray-700 ml-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass("email")}
                placeholder="john@company.com"
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1 font-bold ml-1">
                  {errors.email}
                </p>
              )}
            </div>
            {/*Grid Birth date & experience */}
            <div className="grid grid-cols-1 mg:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 ml-1">
                  Birth Date *
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className={inputClass("birthDate")}
                />
                {errors.birthDate && (
                  <p className="text-xs text-red-600 mt-1 font-bold ml-1">
                    {errors.birthDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 ml-1">
                  Experience Years *
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  className={inputClass("experienceYears")}
                />
                {errors.experienceYears && (
                  <p className="text-xs text-red-600 mt-1 font-bold ml-1">
                    {errors.experienceYears}
                  </p>
                )}
              </div>
            </div>
            {/* Grid password fields*/}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 ml-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass("password")}
                  placeholder="********"
                />
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1 font-bold ml-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 ml-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={inputClass("confirmPassword")}
                  placeholder="********"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 mt-1 font-bold ml-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
            <button type="submit"
             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 mt-6 uppercase tracking-wider"            
            >
                Create Account
            </button>
          </form>
        </div>
      </div>
    );
}

export default UserForm;


