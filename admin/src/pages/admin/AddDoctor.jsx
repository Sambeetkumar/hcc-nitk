import React, { useState, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { toast } from "react-hot-toast";
import axios from "axios";
import Spinner from "../../components/Spinner";
function AddDoctor() {
  const { backendUrl, aToken } = useContext(AdminContext);
  const [formData, setFormData] = useState({
    image: false,
    name: "",
    email: "",
    password: "",
    experience: "1 Year",
    about: "",
    speciality: "General physician",
    degree: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  function handleChange(event) {
    setFormData((prevData) => {
      return {
        ...prevData,
        [event.target.name]:
          event.target.type == "file"
            ? event.target.files[0]
            : event.target.value,
      };
    });
  }
  async function onSubmitHandler(event) {
    event.preventDefault();
    setLoading(true);
    //converting our formdata object to a instance of FromData API
    const formDaata = new FormData();
    for (const key in formData) {
      formDaata.append(key, formData[key]);
    }
    try {
      if (!formData.image) {
        toast.error("Image Not Selected");
        setLoading(false);
        return;
      }

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formDaata,
        {
          headers: {
            atoken: aToken,
          },
        }
      );
      if (data.success) {
        toast.success(data.message);
        setFormData({
          image: false,
          name: "",
          email: "",
          password: "",
          experience: "1 Year",
          about: "",
          speciality: "General physician",
          degree: "",
          address: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
    setLoading(false);
  }
  return loading ? (
    <Spinner />
  ) : (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={
                formData.image
                  ? URL.createObjectURL(formData.image)
                  : assets.upload_area
              }
              alt=""
            />
          </label>
          <input
            onChange={handleChange}
            type="file"
            id="doc-img"
            name="image"
            hidden
          />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Name</p>
              <input
                onChange={handleChange}
                value={formData.name}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Name"
                name="name"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                onChange={handleChange}
                value={formData.email}
                className="border rounded px-3 py-2"
                type="email"
                placeholder="Email"
                name="email"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Password</p>
              <input
                onChange={handleChange}
                value={formData.password}
                className="border rounded px-3 py-2"
                type="password"
                placeholder="Password"
                name="password"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select
                onChange={handleChange}
                value={formData.experience}
                className="border rounded px-3 py-2"
                name="experience"
                id="experience"
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
                <option value="9 Year">9 Year</option>
                <option value="10 Year">10 Year</option>
              </select>
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Speciality</p>
              <select
                onChange={handleChange}
                value={formData.speciality}
                className="border rounded px-3 py-2"
                name="speciality"
                id="speciality"
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Education</p>
              <input
                onChange={handleChange}
                value={formData.degree}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Education"
                name="degree"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                onChange={handleChange}
                value={formData.addresss}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="address"
                name="address"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea
            onChange={handleChange}
            value={formData.about}
            className="w-full px-4 pt-2 border rounded"
            placeholder="write about doctor"
            rows={5}
            name="about"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-4 text-white rounded-full"
        >
          Add doctor
        </button>
      </div>
    </form>
  );
}

export default AddDoctor;
