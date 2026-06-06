import PageTransition from "../components/common/PageTransition";
import useAuth from "../hooks/useAuth";

const formatDate = (date) => {
  if (!date) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

const ProfileCard = ({ user }) => {
  const initials = user?.fullName
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <section className="profile-card">
      <div className="profile-hero">
        <div className="profile-avatar" aria-hidden="true">
          {initials || "RC"}
        </div>
        <div>
          <p className="eyebrow">Account Profile</p>
          <h1>{user.fullName}</h1>
          <p>@{user.username}</p>
        </div>
      </div>

      <div className="profile-grid">
        <div>
          <span>Full Name</span>
          <strong>{user.fullName}</strong>
        </div>
        <div>
          <span>Username</span>
          <strong>{user.username}</strong>
        </div>
        <div>
          <span>Email</span>
          <strong>{user.email}</strong>
        </div>
        <div>
          <span>Account Created</span>
          <strong>{formatDate(user.createdAt)}</strong>
        </div>
      </div>
    </section>
  );
};

const Profile = () => {
  const { user } = useAuth();

  return (
    <PageTransition className="account-page">
      <ProfileCard user={user} />
    </PageTransition>
  );
};

export default Profile;
