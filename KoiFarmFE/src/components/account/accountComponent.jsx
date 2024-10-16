import PropTypes from "prop-types";

// Account class constructor
class Account {
  constructor(
    id,
    name,
    roleId,
    gender,
    email,
    password,
    phone,
    address,
    dateOfBirth,
    point,
    status,
    createdDate,
    modifiedDate,
    deletedDate,
    isDeleted,
    consignments,
    feedbacks,
    orders,
    role
  ) {
    this.id = id;
    this.name = name;
    this.roleId = roleId;
    this.gender = gender;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.address = address;
    this.dateOfBirth = dateOfBirth;
    this.point = point;
    this.status = status;
    this.createdDate = createdDate;
    this.modifiedDate = modifiedDate;
    this.deletedDate = deletedDate;
    this.isDeleted = isDeleted;
    this.consignments = consignments;
    this.feedbacks = feedbacks;
    this.orders = orders;
    this.role = role;
  }
}

// AccountComponent to display account information
const AccountComponent = ({ account }) => {
  return (
    <div>
      <h1>Account Information</h1>
      <p>
        <strong>ID:</strong> {account.id}
      </p>
      <p>
        <strong>Name:</strong> {account.name}
      </p>
      <p>
        <strong>Email:</strong> {account.email}
      </p>
      <p>
        <strong>Phone:</strong> {account.phone}
      </p>
      <p>
        <strong>Status:</strong> {account.status}
      </p>
      <p>
        <strong>Point:</strong> {account.point}
      </p>
      <p>
        <strong>Is Deleted:</strong> {account.isDeleted ? "Yes" : "No"}
      </p>
    </div>
  );
};

// Define PropTypes for AccountComponent
AccountComponent.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    roleId: PropTypes.number,
    gender: PropTypes.string,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    phone: PropTypes.string,
    address: PropTypes.string,
    dateOfBirth: PropTypes.string,
    point: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    createdDate: PropTypes.string,
    modifiedDate: PropTypes.string,
    deletedDate: PropTypes.string,
    isDeleted: PropTypes.bool.isRequired,
    consignments: PropTypes.array,
    feedbacks: PropTypes.array,
    orders: PropTypes.array,
    role: PropTypes.string,
  }).isRequired,
};

export default Account;
