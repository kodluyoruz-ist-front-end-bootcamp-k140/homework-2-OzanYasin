import React, { useEffect, useState } from 'react';
import { Button } from '../button';
import { FormItem } from '../form-item';
import Pagination from '../pagination';

export function DataGrid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [order, setOrder] = useState(Boolean);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);

  const [todo, setTodo] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  // Sorting
  const sorting = (col) => {
    if (order) {
      const sorted = [...items].sort((a, b) => (a[col] > b[col] ? -1 : -1));
      setItems(sorted);
      setOrder(false);
    } else {
      const sorted = [...items].sort((a, b) => (a[col] < b[col] ? -1 : 1));
      setItems(sorted);
      setOrder(true);
    }
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const loadData = () => {
    setLoading(true);
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then((x) => x.json())
      .then((response) => {
        setItems(response);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };
  const renderBody = () => {
    return (
      <React.Fragment>
        {currentItems.map((item, i) => {
          return (
            <tr key={i}>
              <th scope="row">{item.id}</th>
              <td>{item.title}</td>
              <td>{item.completed ? 'Tamamlandı' : 'Yapılacak'}</td>
              <td>
                <Button
                  className="btn btn-xs btn-danger"
                  onClick={() => onRemove(item.id)}
                >
                  Sil
                </Button>
                <Button
                  className="btn btn-xs btn-warning"
                  onClick={() => onEdit(item)}
                >
                  Düzenle
                </Button>
              </td>
            </tr>
          );
        })}
      </React.Fragment>
    );
  };

  const renderTable = () => {
    return (
      <div>
        <Button onClick={onAdd}>Ekle</Button>
        <table className="table">
          <thead>
            <tr>
              <th scope="col" onClick={() => sorting('id')}>
                #
              </th>
              <th scope="col" onClick={() => sorting('title')}>
                Başlık
              </th>
              <th scope="col" onClick={() => sorting('completed')}>
                Durum
              </th>
              <th scope="col">Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>{renderBody()}</tbody>
        </table>
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={items.length}
          paginate={paginate}
        />
      </div>
    );
  };

  const saveChanges = () => {
    // insert
    if (todo && todo.id === -1) {
      todo.id = Math.max(...items.map((item) => item.id)) + 1;
      setItems((items) => {
        items.push(todo);
        return [...items];
      });

      alert('Ekleme işlemi başarıyla gerçekleşti.');
      setTodo(null);
      return;
    }
    // update
    const index = items.findIndex((item) => item.id == todo.id);
    setItems((items) => {
      items[index] = todo;
      return [...items];
    });
    setTodo(null);
  };

  const onAdd = () => {
    setTodo({
      id: -1,
      title: '',
      completed: false,
    });
  };

  const onRemove = (id) => {
    const status = window.confirm('Silmek istediğinize emin misiniz?');

    if (!status) {
      return;
    }
    const index = items.findIndex((item) => item.id == id);

    setItems((items) => {
      items.splice(index, 1);
      return [...items];
    });
  };

  const onEdit = (todo) => {
    setTodo(todo);
  };

  const cancel = () => {
    setTodo(null);
  };

  const renderEditForm = () => {
    return (
      <>
        <FormItem
          title="Title"
          value={todo.title}
          onChange={(e) =>
            setTodo((todos) => {
              return { ...todos, title: e.target.value };
            })
          }
        />
        <FormItem
          component="checkbox"
          title="Completed"
          value={todo.completed}
          onChange={(e) =>
            setTodo((todos) => {
              return { ...todos, completed: e.target.checked };
            })
          }
        />
        <Button onClick={saveChanges}>Kaydet</Button>
        <Button className="btn btn-default" onClick={cancel}>
          Vazgeç
        </Button>
      </>
    );
  };

  return (
    <>{loading ? 'Yükleniyor....' : todo ? renderEditForm() : renderTable()}</>
  );
}
