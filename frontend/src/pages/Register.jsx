import { useState } from 'react';
import { register } from '../services/authService';

function Register() {

    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const result = await register({
                nombre,
                email,
                password
            });

            alert(result.message);

        } catch (error) {

            alert(
                error.response?.data?.error
            );

        }

    };

    return (
        <div className="container mt-5">

            <h2>Registro</h2>

            <form onSubmit={handleSubmit}>

                <input
                    className="form-control mb-2"
                    placeholder="Nombre"
                    onChange={(e) =>
                        setNombre(e.target.value)
                    }
                />

                <input
                    className="form-control mb-2"
                    placeholder="Email"
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Contraseña"
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <button
                    className="btn btn-primary"
                >
                    Registrarse
                </button>

            </form>

        </div>
    );
}

export default Register;