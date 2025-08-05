'use client'
import { InputField, SelectField } from "@/app/shared";
import { useUserOptions } from "@/app/shared/lib/utilities/hooks";

export function AddUserForm() {
  const { roles, countries, statuses } = useUserOptions();
  return (
    <form
      className="tw:flex tw:flex-col tw:gap-y-5 tw:!my-4"
      id="add-user-form"
    >
      <InputField name="name" label="Name" placeholder="Enter your name" />
      <InputField name="email" label="Email" placeholder="Enter your email" />
      <InputField name="phone" label="Phone" placeholder="Enter your phone" />
      <SelectField
        name="country"
        label="Country"
        placeholder="Select country"
        options={countries}
      />
      <SelectField
        name="role"
        label="Role"
        placeholder="Select role"
        options={roles}
      />
      <SelectField
        name="status"
        label="Status"
        placeholder="Select status"
        options={statuses}
      />
    </form>
  );
}
