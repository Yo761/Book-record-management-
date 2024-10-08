let books = [];
const perPage = 5;
let currentPage = 1;

// Load books from localStorage when page loads
document.addEventListener('DOMContentLoaded', () => {
    books = JSON.parse(localStorage.getItem('books')) || [];
    displayBooks();
});

// Add or edit a book
document.getElementById('book-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;
    const bookId = document.getElementById('book-id').value;

    if (title === '' || author === '' || isbn === '') {
        alert('Please fill all fields');
        return;
    }

    const book = { title, author, isbn };

    if (bookId) {
        books[bookId] = book;
    } else {
        books.push(book);
    }

    localStorage.setItem('books', JSON.stringify(books));
    displayBooks();
    resetForm();
});

// Display books with pagination
function displayBooks() {
    const bookList = document.getElementById('book-list').getElementsByTagName('tbody')[0];
    bookList.innerHTML = '';

    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const currentBooks = books.slice(start, end);

    currentBooks.forEach((book, index) => {
        const newRow = bookList.insertRow();

        const titleCell = newRow.insertCell(0);
        const authorCell = newRow.insertCell(1);
        const isbnCell = newRow.insertCell(2);
        const actionCell = newRow.insertCell(3);

        titleCell.textContent = book.title;
        authorCell.textContent = book.author;
        isbnCell.textContent = book.isbn;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit-btn';
        editBtn.onclick = () => editBook(index + start);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => deleteBook(index + start);

        actionCell.appendChild(editBtn);
        actionCell.appendChild(deleteBtn);
    });

    document.getElementById('page-num').textContent = `Page ${currentPage}`;
    updatePagination();
}

// Edit a book
function editBook(index) {
    const book = books[index];
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('isbn').value = book.isbn;
    document.getElementById('book-id').value = index;
}

// Delete a book
function deleteBook(index) {
    books.splice(index, 1);
    localStorage.setItem('books', JSON.stringify(books));
    displayBooks();
}

// Reset form after submission
function resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
    document.getElementById('book-id').value = '';
}

// Search functionality
document.getElementById('search').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query) || 
        book.isbn.includes(query)
    );
    books = filteredBooks.length ? filteredBooks : JSON.parse(localStorage.getItem('books')) || [];
    displayBooks();
});

// Pagination controls
document.getElementById('prev').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayBooks();
    }
});

document.getElementById('next').addEventListener('click', () => {
    if (currentPage * perPage < books.length) {
        currentPage++;
        displayBooks();
    }
});

// Update pagination buttons
function updatePagination() {
    document.getElementById('prev').disabled = currentPage === 1;
    document.getElementById('next').disabled = currentPage * perPage >= books.length;
}
