# LiveDocs  

LiveDocs is a collaborative document editor inspired by Google Docs. Built with Next.js for the user interface, Liveblocks for real-time functionality, and styled using TailwindCSS, this project highlights the developer’s expertise in building real-time, collaborative applications.  

Whether you’re new or need help, join our vibrant Discord community of over 34k members, where users actively share solutions and ideas.  

---

## ⚙️ Tech Stack  

- **Next.js**  
- **TypeScript**  
- **Liveblocks**  
- **Lexical Editor**  
- **ShadCN**  
- **Tailwind CSS**  

---

## 🔋 Features  

👉 **Secure Authentication**  
Sign in with GitHub using NextAuth for a secure and smooth login experience.  

👉 **Real-Time Collaboration**  
Work on documents simultaneously with others and see updates in real time.  

👉 **Document Management**  
- **Create Documents**: Quickly create and auto-save new documents.  
- **Delete Documents**: Remove documents you no longer need.  
- **Share Documents**: Share documents via email or link, with options for view or edit permissions.  
- **Browse Documents**: View all owned and shared documents, with search and sorting capabilities.  

👉 **Inline and Threaded Comments**  
Add comments directly within the document or start discussions with threaded replies.  

👉 **Active Collaborator Indicators**  
See who else is editing with real-time presence indicators.  

👉 **Notifications**  
Stay informed with alerts for shared documents, comments, and collaborator actions.  

👉 **Responsive Design**  
Enjoy a seamless experience on desktops, tablets, and mobile devices.  

... and more, including reusable components and a scalable codebase.  

---

## 🤸 Quick Start  

Set up LiveDocs locally by following these steps.  

### Prerequisites  

Ensure you have the following installed on your system:  

- **Git**  
- **Node.js**  
- **npm** (or your preferred package manager)  

### Clone the Repository  

```bash  
git clone https://github.com/Nainee99/live_docs.git  
cd live_docs  
```  

### Install Dependencies  

Install the required packages with npm:  

```bash  
npm install  
```  

### Configure Environment Variables  

Create a `.env` file in the root directory and include the following:  

```env  
# Clerk  
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=  
CLERK_SECRET_KEY=  
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in  
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up  

# Liveblocks  
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=  
LIVEBLOCKS_SECRET_KEY=  
```  

Replace the placeholder values with your actual **Clerk** and **Liveblocks** credentials, which you can obtain by signing up on their respective platforms.  

### Start the Application  

Run the development server:  

```bash  
npm run dev  
```  

Visit [http://localhost:3000](http://localhost:3000) in your browser to start using LiveDocs.  

---

## 🛠️ Contributing  

Contributions are welcome! Feel free to open issues or submit pull requests to enhance the project.  

---

## 📄 License  

This project is licensed under the MIT License.  
