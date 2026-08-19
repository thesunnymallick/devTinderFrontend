import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateUserProfile, clearProfileError, clearProfileSuccess } from "../../store/authSlice";
import { validateFirstName, validateLastName } from "../../utils/validation";
import NavBar from "../../components/shared/NavBar";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  bio: string;
  photoUrl: string;
  skills: string; // comma-separated in the UI, split into an array on submit
}

const emptyForm: ProfileFormData = {
  firstName: "",
  lastName: "",
  age: "",
  gender: "",
  bio: "",
  photoUrl: "",
  skills: "",
};

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, updatingProfile, profileError, profileSuccess } = useAppSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState<ProfileFormData>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<{ firstName?: string; lastName?: string }>({});

  // Populate the form once the user is available (or refreshed after a save)
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        age: user.age !== undefined ? String(user.age) : "",
        gender: user.gender ?? "",
        bio: user.bio ?? "",
        photoUrl: user.photoUrl ?? "",
        skills: Array.isArray(user.skills) ? user.skills.join(", ") : "",
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (profileError) dispatch(clearProfileError());
    if (profileSuccess) dispatch(clearProfileSuccess());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: { firstName?: string; lastName?: string } = {};
    const firstNameResult = validateFirstName(formData.firstName);
    if (!firstNameResult.valid) newErrors.firstName = firstNameResult.message;
    const lastNameResult = validateLastName(formData.lastName);
    if (!lastNameResult.valid) newErrors.lastName = lastNameResult.message;

    setFieldErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    dispatch(
      updateUserProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        age: formData.age ? Number(formData.age) : undefined,
        gender: formData.gender || undefined,
        bio: formData.bio.trim() || undefined,
        photoUrl: formData.photoUrl.trim() || undefined,
        skills: formData.skills
          ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
      })
    );
  };

  const inputClass = (hasError?: boolean) =>
    `w-full px-4 py-2.5 text-sm rounded-xl bg-[#18181B] border text-white placeholder:text-[#71717A] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 ${
      hasError ? "border-red-500" : "border-[#2A2A35] focus:border-[#8B5CF6]"
    }`;

  return (
    <div className="min-h-screen bg-[#0D0D0F] flex flex-col">
      <NavBar />
      <main className="flex-1 flex items-start sm:items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#141418]/60 border border-[#2A2A35] rounded-2xl p-6 sm:p-8 my-6">
          <h2 className="text-xl font-bold text-white mb-5">Edit profile</h2>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {profileSuccess && (
              <div className="p-3 bg-green-900/30 border border-green-500/50 rounded-lg">
                <p className="text-green-400 text-sm font-medium">✓ Profile updated</p>
              </div>
            )}
            {profileError && (
              <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm font-medium">{profileError}</p>
              </div>
            )}

            {/* photo preview */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-[#18181B] overflow-hidden flex items-center justify-center text-slate-500 font-bold text-xl border border-[#2A2A35]">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    {formData.firstName?.[0]}
                    {formData.lastName?.[0]}
                  </>
                )}
              </div>
            </div>

            {/* First / Last name */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  First name
                </label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={inputClass(Boolean(fieldErrors.firstName))}
                />
                {fieldErrors.firstName && (
                  <p className="text-red-400 text-xs mt-1">{fieldErrors.firstName}</p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Last name
                </label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={inputClass(Boolean(fieldErrors.lastName))}
                />
                {fieldErrors.lastName && (
                  <p className="text-red-400 text-xs mt-1">{fieldErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Age / Gender */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Age</label>
                <input
                  name="age"
                  type="number"
                  min={18}
                  value={formData.age}
                  onChange={handleChange}
                  className={inputClass()}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputClass()}
                >
                  <option value="">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Photo URL
              </label>
              <input
                name="photoUrl"
                value={formData.photoUrl}
                onChange={handleChange}
                placeholder="https://..."
                className={inputClass()}
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Bio</label>
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                className={`${inputClass()} resize-none`}
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Skills <span className="text-slate-500 font-normal">(comma separated)</span>
              </label>
              <input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                className={inputClass()}
              />
            </div>

            <button
              type="submit"
              disabled={updatingProfile}
              className="w-full bg-gradient-to-r from-[#7C5CFF] via-[#8B5CF6] to-[#A78BFA] text-white font-semibold py-2.5 text-sm rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {updatingProfile ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;